require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenses");
const userRoutes = require("./routes/user");
const cors = require("cors");
// express app
const app = express();

// middleware
app.use(express.json());

// app.use(
//   cors({
//     origin: "https://localhost:3000",
//   })
// );
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes

// User login and signup
app.use("/api/user", userRoutes);

app.use("/api/expenses", expenseRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
