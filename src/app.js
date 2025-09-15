const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async(req,res)=>{

    //creating a new instance of User model
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User Added Successfully!");
    }
    catch(err){
        res.status(400).send("Error saving the data:" + err.message);
    }
});

//get user by email
app.get("/user", async (req,res)=>{
  const userEmail = req.body.email;
  
  try {
    const users = await User.find({email: userEmail});

    if(users.length===0){
      res.status(404).send("User not found")
    }
    else{
      res.send(users)
    }

  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Feed api => Get all users from the database
app.get("/feed", async (req,res)=>{
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
})

app.delete("/user", async (req,res)=>{
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully")
    console.log("delete ho gaya")
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
})

app.patch("/user", async (req,res)=>{
  const userId = req.body.userId;
  const data = req.body;

  try {
    await User.findByIdAndUpdate({_id: userId},data,{
      returnDocument: "after",
      runValidators: true
    })
    res.send("User updated successfully")
  } catch (error) {
    res.status(400).send("UPDATE FAILED" + error.message);
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

