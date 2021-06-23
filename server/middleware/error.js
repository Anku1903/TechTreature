const ErrorRes=require('../utils/errorResponse')

const errorHandler=(err,req,res,next)=>{
    let error={...err};
    error.message=err.message
    console.log(err)
    if(err.code===11000){
        const message="Duplicate field Value Enter";
        error=new ErrorRes(message,400);
    }
    if(err.name==="ValidationError"){
        const message=Object.values(err.errors).map((val)=>val.message)
        error=new ErrorRes(message,400)
    }
    res.status(err.statuscode || 500).json({
        success:false,
        error:error.message || "Server Error"
    })
}

module.exports=errorHandler