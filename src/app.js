const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("../src/routes/auth");
const profileRouter = require("../src/routes/profile");
const requestRouter = require("../src/routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);



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
