const mongoose=require('mongoose');
const jobSchema =new mongoose.Schema({
    jobTitle:{
        type:String,
        required:[true,"please provide a Job title"]

    },
    description:{
        type:String,
        required:[true,"please provide Description"]
    },
    jobType:{
        type:String,
        required:[true,"please provide a Job type"],
        enum:['Full time','Part time','intern']
    },
    location:{
        type:String,
        required:[true,"please provide a location"]
    },
    post_by:{
        type:String,
        required:[true,"please provide a Email id"]
    },
    skills:[
        {
            type: String,
        }
    ],
    usersApply:[
        {type:mongoose.Schema.Types.ObjectId, ref :"User"}
    ],
    updateDate:Date
});



const Jobs=mongoose.model("Jobs",jobSchema);

module.exports = Jobs;