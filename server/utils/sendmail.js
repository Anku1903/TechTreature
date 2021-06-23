const nodemailer=require("nodemailer")

const sendmail=(options)=>{
    const transporter=nodemailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    const mailoptions={
        from:process.env.EMAIL_FROM,
        to:options.to,
        subject:options.subject,
        html:options.text
    }
    transporter.sendMail(mailoptions, function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log(info)
        }
    })
}
module.exports=sendmail;