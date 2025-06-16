const express = require('express');
const app = express();

app.get("/", (req,res) => {
    res.send("Hello this is Node Project");
})

app.get("/test", (req,res)=>{
    res.send("We will test our App End to End");
})

app.listen(8000, ()=>{
    console.log("Server listening to Port 8000");
})