let mail_of_126 = {
    transporter: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'csw199502@126.com',
            pass: 'nuola123ali789'
        }
    },
    mail: {
        from: "csw199502<csw199502@126.com>",
    }
}
let mail_of_qq = {
    transporter: {
        host: 'smtp.qq.com',
        port: 465,
        auth: {
            user: '470136090@qq.com',
            pass: 'fekmeixcpnrkcadg'
        }
    },
    mail: {
        from: "謎_謎<470136090@qq.com>",
    }
}

module.exports.transporter = mail_of_qq.transporter;
module.exports.mail = mail_of_qq.mail;