exports.getPrivateData=(req,res,next)=>{
    res.status(201).json({
        success:true,
        data:"You get access to the private data in this route"
    })
}