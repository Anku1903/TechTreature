const mongoose=require('mongoose');
const crypto=require('crypto');
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please provide a username"]

    },
    email:{
        type:String,
        required:[true,"please provide a email"],
        unique:true,
        match:[
            /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
            "please provide a valid email"
        ]
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength:6,
        select:false
    },
    role:{
        type:String,
        required:[true,"please provide a role"],
        enum:['student','recruiter']
    },
    applyforjob:[
        {type:mongoose.Schema.Types.ObjectId, ref :"Job"}
    ],
    resetPasswordToken:String,
    resetPasswordExpires:Date,

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.matchPasswords=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.getsignedToken=function(){
    return jwt.sign({id:this._id,email:this.email},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_TOKEN_EXPIR
    })
}

userSchema.methods.genRegToken=function(){
    return jwt.sign({
        email:this.email,
        password:this.password,
        role:this.role,
        username:this.username
    },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIR
    })
}

userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpires=Date.now()+10+(60*1000)
    return resetToken;
}
const User=mongoose.model("User",userSchema);

module.exports = User;