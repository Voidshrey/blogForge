import nodemailer from 'nodemailer'

 async function send({to,text,html,subject}) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'octavia.kihn70@ethereal.email',
          pass: 'A2tVBgPaVx2kyMpEz4'
      }
    });
    // send mail with defined transport object
   await transporter.sendMail({
      from: 'octavia.kihn70@ethereal.email', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

  }

  export default send;