import nodemailer from 'nodemailer';
import mg from 'mailgun-js'

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'gabe.blanda13@ethereal.email',
      pass: 'zJNU9aZbeGjw6BbmNr'
  }
});

let store = '';

export const verifyEmail = async (req, res) => {
  const email = Object.keys(req.body)[0];
  const OTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  const mailOptions = {
    from: 'miami Abner Jerde 👻 <kiranraj80555@gmail.com>', // sender address
    to: email,
    subject: "OTP for your youtube login. ✔", 
    text: 'hiii',
    html: `<b>Hello there this is the OTP for you youtube login/signup ${OTP} . Be aware of your account and do not share any OTP to any one...!</b>`, 
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    store = OTP
    res.status(200).json({ message: `Email sent successfully OTP is ${OTP}` });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const verifyOTP = async (req, res) => {
  const OTP = Object.keys(req.body)[0];
  console.log(JSON.stringify(store),OTP)
  try{
    if(OTP === JSON.stringify(store)){
      res.status(200).json({ message: 'OTP verified successfully',status:'OK' });
    } else{
      res.status(400).json({ message: 'Invalid OTP',status:'NOT OK' });
    }
  }catch{
    res.status(500).json({ message: 'Internal Server Error',status:'NOT OK'});
  }
};
