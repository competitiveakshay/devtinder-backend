const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User does not exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;

  res.send(user.firstName + " sent the connection request");
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(8000, () => {
      console.log("Server listening to Port 8000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
