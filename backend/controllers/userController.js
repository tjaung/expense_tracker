const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const mongoose = require("mongoose");

const findSingleUser = async (req, res) => {
  const id  = req.user._id;
  // console.log('conrtroller level: ', req.user._id)
  try{
    const user = await User.queryOneWithId(id);
    // console.log('find single user: ', user)
    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
};


const storePlaidToken = async (req, res) => {
  console.log('controller level req body:', req.body)
  console.log('controller level user_id: ', req.user._id)
  const token = req.body
  
  try {
    const user = await User.storePlaidToken(req.user._id, token)

    res.status(200).json({token})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const createJWToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createJWToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signUpUser = async (req, res) => {
  const { email, password } = req.body;

  // if sign up succesful add user model to db and return
  try {
    
    const user = await User.signUp(email, password);
    const token = createJWToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signUpUser,
  storePlaidToken,
  findSingleUser
};
