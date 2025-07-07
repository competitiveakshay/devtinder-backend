const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');

app.post("/signup", async(req,res)=>{
    const user = new User({
        firstName: "Virat",
        lastName: "kohli",
        email: "virat@gmail.com",
        password: "viratbhai"
    });

    try{
        await user.save();
        res.send("User Added Successfully!");
    }
    catch(err){
        res.status(400).send("Error saving the data:" + err.message);
    }
})

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(8000, ()=>{
        console.log("Server listening to Port 8000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });

