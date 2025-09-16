const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation')
const bcrypt = require("bcrypt")

app.use(express.json());

app.post("/signup", async(req,res)=>{
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, email, password} = req.body;

        // Encrypt the password
        const hashPassword = await bcrypt.hash(password,10);
        console.log(hashPassword);

        //creating a new instance of User model
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashPassword
        });

        await user.save();
        res.send("User Added Successfully!");
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

app.post("/login", async (req,res)=>{
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email:email});

    if(!user){
      throw new Error("Login Failed");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){
      res.send("Login Successful");
    }
    else{
      throw new Error("Login Failed");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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

app.patch("/user/:userId", async (req,res)=>{
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"]

    const isUpdateAllowed = Object.keys(data).every((k)=>
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not allowed")
    }

    if(data?.skills.length>10){
      throw new Error("Skills can not be more than 10")
    }

    await User.findByIdAndUpdate({_id: userId},data,{
      returnDocument: "after",
      runValidators: true
    })
    res.send("User updated successfully")
  } catch (error) {
    res.status(400).send("UPDATE FAILED " + error.message);
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

