const nodemailer = require('nodemailer');

// creating a trasporter
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
});

// send reset email
module.exports.sendResetEmail = async (email, token)=>{
    let url = 'http://localhost:8000/user/reset-password?token=' + token;

    console.log(url);

    await transport.sendMail({
        from: process.env.EMAIL_ID,
        to: email,
        subject: "RESET PASSWORD",
        text: `Click this link to reset your password: ${url}`,
        html: `<p>
        Click this link to reset your password: <a href="${url}" target="_blank">${url}</a>
        </p>`
    })
}

// send email verification mail
module.exports.sendVerifyEmail = async (email, token) =>{
    let url = 'http://localhost:8000/user/verifyEmail?token=' + token;
    console.log(url);

    await transport.sendMail({
        from: process.env.EMAIL_ID,
        to: email,
        subject: "VERIFY YOUR ACCOUNT",
        text: `Click this link to verify: ${url}`,
        html: `<p>
        Click this link to verify: <a href="${url}" target="_blank">${url}</a>
        </p>`
    })
}