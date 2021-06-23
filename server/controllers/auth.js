const User=require('../models/User')
const errorResponse = require('../utils/errorResponse')
const sendmail = require('../utils/sendmail')
const crypto = require("crypto")
const jwt=require("jsonwebtoken")
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.register=async (req,res,next)=>{
   const { username,email,password,role}=req.body;
   try{
    // User.findOne({email:req.body.email})
    // .exec(async (error,user)=>{
    // if(user) return res.status(400).json({
    //     message : "user already registered"
    // });
    const user= new User({
        username,
        email,
        password,
        role
    })
   const token= user.genRegToken();
   const regurl=`http://localhost:3000/validate/${token}`
   const message=`
   <h1>You have requested for a new registration</h1>
   <p>Please Go through this link to registration</p>
   <a href=${regurl} clicktracking=off>${regurl}</a> </a>
   `

   try{
    await sendmail({
        to:user.email,
        subject:"Verify your email",
        text:message,
        })
     res.status(200).json({success:true,data:"Email Sent"})
    }catch(error){
        return next(new errorResponse("Email could not be sent",500))
    }
   }catch(error){
    next(error);
   }
}

exports.registerDB=async(req,res,next)=>{
    const token=req.params.regToken
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    // res.status(200).json({success:true,data:decoded});
    const user=await User.create(decoded)
        if(!user){
            return next(new errorResponse("something went wrong",500))
        }
    sendToken(user, 200, res);

}

exports.login=async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new errorResponse("please provide an email and password",400))
    }
    try{
        const user=await User.findOne({email}).select("+password")
        if(!user){
            return next(new errorResponse("invalid credentials",401))
        }
        const ismatch=await user.matchPasswords(password);

        if(!ismatch){
            return next(new errorResponse("invalid credentials",401))
        }
        sendToken(user,200,res);
    }catch(error){
        next(error);
    }
}

exports.forgotpassword=async(req,res,next)=>{
    const {email}=req.body;
    try{
        const user=await User.findOne({email})
        if(!user){
            return next(new errorResponse("Email Could not be sent",404))

        }
        const resetToken=user.getResetPasswordToken();

        await user.save();

        const reseturl=`http://localhost:3000/passwordrest/${resetToken}`

        const message=`
        <h1>You have requested a password reset</h1>
        <p>Please Go this link to reset yout password</p>
        <a href=${reseturl} clicktracking=off>${reseturl}</a> </a>
        `
        try{
            await sendmail({
                to:user.email,
                subject:"Password reset Request",
                text:message,
            })
            // const msg = {
            //     to: user.email,
            //     from: 'webdev1903@gmail.com', // Use the email address or domain you verified above
            //     subject: 'Password reset Request',
            //     text: message
            //   };
            //   //ES6
            //   sgMail
            //     .send(msg)
            //     .then(() => {
            //         console.log("success");
            //         res.status(200).json({success:true,data:"Email Sent"})
            //     }, error => {
            //         next(error);
            //     });
              
            res.status(200).json({success:true,data:"Email Sent"})
        }catch(error){
            user.resetPasswordToken=undefined;
            user.resetPasswordExpires=undefined;
            await user.save();
            return next(new errorResponse("Email could not be sent",500))
        }
    }catch(error){
        next(error);
    }
}   

exports.resetpassword=async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    try{
        const user=await User.findOne({ 
            resetPasswordToken,
            resetPasswordExpires:{$gt:Date.now()}
        })
        if(!user){
            return next(new errorResponse("Invalid Reset TOKEN",400))
        }
        user.password=req.body.password;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpires=undefined;
        await user.save();
        res.status(201).json({success:true,data:"passsword reset successfully"})
    }catch(error){
        next(error)
    }
}

const sendToken=(user,statuscode,res)=>{
    const token=user.getsignedToken()
    res.status(statuscode).json({success:true,token:token})
    
}