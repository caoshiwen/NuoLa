let {
    send,
    SUBJECT
} = require("../service/mailer/mailer");

var mail = {
    // 主题
    subject: SUBJECT.getActivateCode,
    // 收件人
    to: 'csw199502@126.com',
    // 邮件内容，HTML格式
    text: `Hi,Kurt. Please click this(www.baidu.com) to active the account of RuoLa.
    And if this is not your operation, ignore it.` //接收激活请求的链接
};

send(mail, function(info){

},function(error) {

});