require("dotenv").config();

const { Configuration, PlaidApi, Products, PlaidEnvironments } = require('plaid');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const moment = require('moment');
const session = require("express-session");
const express = require("express");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenses");
const userRoutes = require("./routes/user");
const cors = require("cors");


// express app
const app = express();

// plaid connection
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',');

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');

const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;
let PAYMENT_ID = null;
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null;

// Initialize the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Creates a session key, which we can use to store the user's access token
// (Convenient for demo purposes, bad for a production-level app)
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

app.post('/api/info', function (request, response, next) {
  response.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  });
});

// Checks whether or not the user has an access token for a financial
// institution
app.get("/api/is_user_connected", async (req, res, next) => {
  console.log(`Our access token: ${req.session.access_token}`);
  return req.session.access_token
    ? res.json({ status: true })
    : res.json({ status: false });
});

// Retrieves the name of the bank that we're connected to
app.get("/api/get_bank_name", async (req, res, next) => {
  const access_token = req.session.access_token;
  const itemResponse = await plaidClient.itemGet({ access_token });
  const configs = {
    institution_id: itemResponse.data.item.institution_id,
    country_codes: ["US"],
  };
  const instResponse = await client.institutionsGetById(configs);
  console.log(`Institution Info: ${JSON.stringify(instResponse.data)}`);
  const bankName = instResponse.data.institution.name;
  res.json({ name: bankName });
});

app.get("/api/create_link_token", async (req, res, next) => {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: req.sessionID },
    client_name: "Vanilla JavaScript Sample",
    language: "en",
    products: ["transactions"],
    country_codes: ["US"],
  });
  console.log(`Token response: ${JSON.stringify(tokenResponse.data)}`);

  res.json(tokenResponse.data);
});

app.post("/api/auth", async function(request, response) {
 try {
     const access_token = request.body.access_token;
     const plaidRequest = {
         access_token: access_token,
     };
     const plaidResponse = await plaidClient.authGet(plaidRequest);
     response.json(plaidResponse.data);
 } catch (e) {
     response.status(500).send("failed");
 }
});

app.post('/api/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
          public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = plaidResponse.data.access_token;
      console.log(accessToken)
      response.json({ accessToken });
  } catch (error) {
      response.status(500).send("failed");
  }
});

// Fetches balance data using the Node client library for Plaid
app.get("/api/transactions", async (req, res, next) => {

  const access_token = req.headers.access_token;
  // console.log(req.headers)
  const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
  const endDate = moment().format("YYYY-MM-DD");

  const transactionResponse = await plaidClient.transactionsGet({
    access_token: access_token,
    start_date: startDate,
    end_date: endDate,
    options: { count: 10 },
  });
  console.log(transactionResponse.data)
  res.json(transactionResponse.data);
});


// middleware
app.use(express.json());

app.use((req, res, next) => {
  next();
});

// routes
app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
