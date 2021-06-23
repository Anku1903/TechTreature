const jwt=require("jsonwebtoken")
const User=require("../models/User")
const errorresponse=require("../utils/errorResponse")
exports.protect=async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return next(new errorresponse("Not authorized to acces this route",401));
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user =await User.findById(decoded.id);
        if(!user){
            return next(new errorresponse("No user  found with this id",404))
        }
        req.user=user;
        next();
    }catch(error){
        return next(new errorResponse("Not authorized to access this",404))
    }
}