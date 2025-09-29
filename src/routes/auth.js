const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    // Encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    //creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Login Failed");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successful");
    } else {
      throw new Error("Login Failed");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
});

module.exports = authRouter;