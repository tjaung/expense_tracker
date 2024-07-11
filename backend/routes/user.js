const express = require("express");
const { loginUser, signUpUser, storePlaidToken, findSingleUser } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuthentification");

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signUpUser);

router.use(requireAuth);


router.post("/storetoken", storePlaidToken)

router.post('/findById', findSingleUser)

module.exports = router;
