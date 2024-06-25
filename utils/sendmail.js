const nodemailer = require("nodemailer");

exports.sendMail = (req,res,user)=>{
    const OTP = Math.floor(1000 + Math.random() * 9000)
    const transporter = nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        post:465,
        auth:{
            user:process.env.MAIL_ID,
            pass:process.env.MAIL_PASSWORD
        }
    })
    const mailOptions = {
        from:"Omta Pvt. Ltd.<process.env.MAIL_ID>",
        to:req.body.email,
        subject:"Welcome to Omta Pvt. Ltd.",
        html:`<h1>Reset Otp</h1> 
              <h3>OTP:${OTP}</h3>`
    }

    transporter.sendMail(mailOptions,async(err,info)=>{
        if(err){
            return res.send(error)
        }
       console.log(info);
        user.otp = OTP;
        await user.save();
        return res.redirect(`/verify-otp/${user._id}`);
    })
}
