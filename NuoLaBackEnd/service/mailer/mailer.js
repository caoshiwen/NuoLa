var nodemailer = require("nodemailer");
var config = require("../../conf/mailer");

//SMTP
var transporter = nodemailer.createTransport(config.transporter);
let TEXT = {
    getActivateCode: (code) => {
        return `Hey!
        We(RuoLa) just received your registration request. 
        Your registration verification code is g-${code}.
        And if this is not your operation, ignore it. 
        Sorry for trouble. 
        THANKS!`;
    }
}
const SUBJECT = {
    getActivateCode: "Activate account for RuoLa."
}
let send = (mail, success, failed) => {

    // var mail = {
    //     // 发件人
    //     from: '流觞曲水 <xxx@126.com>',
    //     // 主题
    //     subject: '测试',
    //     // 收件人
    //     to: 'xxx@qq.com',
    //     // 邮件内容，HTML格式
    //     text: '点击激活：xxx' //接收激活请求的链接
    // };
    mail.from = config.mail.from;
    console.log(mail);
    transporter.sendMail(mail, function(error, info) {
        if (error) {
            failed(error);
            return console.log(error);
        }
        success(info);
        console.log("mail sent:", info.response);
    });
}
module.exports = {
    TEXT,
    SUBJECT,
    send
};


