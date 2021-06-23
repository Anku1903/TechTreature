const Job=require("../models/Jobs")
const errorResponse = require('../utils/errorResponse')
exports.createjob=async(req,res,next)=>{
    try{
    const {jobTitle,description,jobType,location,post_by}=req.body
    let skills=[];
    if(req.body.skills.length>0){
        req.body.skills.map(skill=>{
            skills.push(skill)
        })
    }
    const job= new Job({
        jobTitle,
        description,
        jobType,
        location,
        post_by,
        skills
    })
    await job.save((error,jobdata)=>{
        if(error){
            return next(new errorResponse("something went wrong",500))
        }
        res.status(200).json({success:true,data:jobdata})
    })
}catch(err){
    next(error);
}



}

exports.updatejob=async(req,res,next)=>{
    try{
        const {jobid,jobTitle,description,jobType,location,post_by}=req.body;
        
        let skills=[];
        if(req.body.skills.length>0){
            req.body.skills.map(skill=>{
                skills.push(skill)
            })
        }
        const job={ 
            jobTitle,
            description,
            jobType,
            location,
            post_by,
            skills
        }
        const post =await Job.findById(jobid);
        if(!post){
            return next(new errorResponse("No Post found with this id",404))
        }
        const response= await Job.findByIdAndUpdate({_id:jobid}, {
            $set: job
        });
        // await doc.save();
        res.status(200).json({success:true,data:response});
    }catch(error){
        next(error);
    }
}

exports.deletejob=async(req,res,next)=>{
    try{
        const jobid = req.params.postId;
        
        const result=await Job.findByIdAndDelete({_id:jobid})
        if(!result){
            return next(new errorResponse("cant find post with this id"),404);
        }
        res.status(201).json({success:true,data:result})
    }
    catch(error){
        next(error)
    }
}