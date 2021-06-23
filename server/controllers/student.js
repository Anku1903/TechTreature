const Job=require("../models/Jobs")
const User=require("../models/User")
const errorResponse = require('../utils/errorResponse')
const mongoose=require('mongoose')

exports.applyonjob=async(req,res,next)=>{
    try{
    const {jobid,userid}=req.body;

    const result=await Job.findById({_id:jobid})
    const user=result.usersApply.find(user=>{
        return user==userid;
    })
    if(!user){
        const result2=await User.findByIdAndUpdate({_id:userid},{
            $push:{
                "applyforjob":[jobid]
            }
        })
        if(!result2){
            return next(new errorResponse("make sure job and user exist",404));
        }
        const result1=await Job.findByIdAndUpdate({_id:jobid},{
            $push:{
                "usersApply":[userid]
            }
        })
        if( !result1){
            return next(new errorResponse("make sure job and user exist",404));
        }
        
        res.status(201).json({success:true,message:"apply on job successfully"});
    }else{
        return next(new errorResponse("you have already applied",400))
    }
    

    }catch(error){
        next(error);
    }
}