import nodemailer from 'nodemailer'

 async function send({to,text,html,subject}) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'berenice.wuckert@ethereal.email',
            pass: 'KvtapY2TFNFgZ5MjF2'
        }
    });
    // send mail with defined transport object
   await transporter.sendMail({
      from: 'berenice.wuckert@ethereal.email', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
  }

  export default send;