const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://akshaygaur160:i2oBF51IP7g8hMZi@cluster0.vh3mh9g.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

