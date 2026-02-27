const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try{
        // Read the toke from the req cookies
        const {token} = req.cookies;

        if(!token){
            res.status(401).send("Please Login!")
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder$128")
        const {_id} = decodedObj
        const user = await User.findById(_id)

        if(!user){
            throw new Error("User not found")
        }
        
        req.user = user;

        next()
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = {
    userAuth,
};