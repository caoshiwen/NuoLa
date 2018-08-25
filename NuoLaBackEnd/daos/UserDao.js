let $dao = require("./Dao"),
    $uresp = require("../service/resp/UserResp"),
    $util = require("../util/Util"),
    {
        send,
        SUBJECT,
        TEXT
    } = require("../service/mailer/mailer");


const sqls = {
    insert: 'INSERT INTO user_keys(user_id, user_name, user_email, user_password) VALUES(?,?,?,?)',
    update: 'update user_keys set user_name=? where id=?',
    delete: 'delete from user_keys where id=?',
    queryById: 'select * from user_keys where user_id=?',
    queryAll: 'select * from user_keys',
    queryByEmailAndPwd: 'select user_id,user_email,user_name from user_keys where user_email = ? and user_password = ?',
    queryEmail: 'select user_email from user_keys where user_email = ?'
}

// let add;
// dateInit();

module.exports = {
    add,
    queryById,
    login,
    logout,
    getActivateMailCode
};
/**
 * 增
 */
function add(req, res, next) {
    let {
        name,
        email,
        password,
        mail_code
    } = req.body;
    let id = new Date().getTime();
    if(checkActivateMailCode(req, mail_code, email)){
        $dao.doQuery(sqls.insert, [id, name, email, password], (err, result) => {
            if(result.affectedRows == 1) {
                result = [{
                    user_id: id,
                    user_email: email,
                    user_name: name,
                }];
            }else{
                result = [];
            }
            $uresp.resp($uresp.CODE.USER_REGISTER, req, res, err, result);
        });
    }else{
        $uresp.resp($uresp.CODE.USER_REGISTER_CODE_WRONG, req, res, null, null);
    }
    
}
function checkActivateMailCode(req, mail_code, email) {
    return req.session.mail_code + "" === mail_code && req.session.email === email;
}
/**
 * 查
 */
function queryById(req, res, next) {
    let {
        id
    } = req.query;
    $dao.doQuery(sqls.queryById, [id], (err, result) => {
        $uresp.resp($uresp.CODE.USER_QUERY_BY_ID, req, res, err, result);
    });
}

function login(req, res, next) {
    let {
        email,
        password
    } = req.body;
    $dao.doQuery(sqls.queryByEmailAndPwd, [email, password], (err, result) => {
        $uresp.resp($uresp.CODE.USER_LOGIN, req, res, err, result);
    });
}

function logout(req, res, next) {
    $uresp.resp($uresp.CODE.USER_LOGOUT, req, res, null, null);
}
/** 
 * 邮箱激活
 */
function getActivateMailCode(req, res, next) {
    let {
        email
    } = req.body;
    // 检验邮箱
    $dao.doQuery(sqls.queryEmail, [email], (err, result) => {
        if(result.length > 0) {
            $uresp.resp($uresp.CODE.USER_CHECK_EMAIL_ONLY, req, res, err, result);
        } else {
            let code = Math.ceil(Math.random()*1000000);
            var mail = {
                // 主题
                subject: SUBJECT.getActivateCode,
                // 收件人
                to: email,
                // 邮件内容，HTML格式
                text: TEXT.getActivateCode(code) //接收激活请求的链接
            };
            send(mail, info => {
                // 发送成功 send succeed
                $uresp.resp($uresp.CODE.USER_GET_MAIL_ACTIVATE_CODE, req, res, null, {code,email});
            }, error => {
                // 发送失败 send failed
                $uresp.resp($uresp.CODE.USER_GET_MAIL_ACTIVATE_CODE, req, res, null, null);
            });
        }
    });
}