let $dao = require("./Dao"),
    $uresp = require("../service/resp/UserResp"),
    $util = require("../util/Util"),
    $CONST = require("../util/CONST")
moment = require("moment"), {
    send,
    SUBJECT,
    TEXT
} = require("../service/mailer/mailer"), {
    decryptRsa,
    encryptKey,
    SCRIPT
} = require("../util/Encryption");

const sqls = {
    insertUser: 'INSERT INTO user_keys(user_id, user_name, user_email, user_password) VALUES(?,?,?,?)',
    updateName: 'update user_keys set user_name = ? where user_id = ? and login_key = ?',
    updatePassword: 'update user_keys set user_password = ? where user_id = ? and login_key = ?',
    updateEmail: 'update user_keys set user_email = ? where user_id = ? and login_key = ?',
    delete: 'delete from user_keys where user_id=?',
    queryById: 'select * from user_keys where user_id=?',
    queryAll: 'select * from user_keys',
    queryByEmailAndPwd: 'select user_id,user_email,user_name from user_keys where user_email = ? and user_password = ?',
    queryEmailForCheckMail: 'SELECT mail FROM mail_activation WHERE (mail_time > ? AND mail = ?) OR mail in (SELECT user_email from user_keys WHERE user_email = ?)',
    //login
    addLoginRecord: 'INSERT INTO logins(user_id, login_key) VALUES(?,?)',
    updateUserLoginKey: 'UPDATE user_keys set login_key = ? where user_id = ?',
    queryLoginRecord: 'select * from logins where user_id = ? and login_key = ?',
    queryUserLogin: 'select user_id,user_email,user_name,user_password from user_keys where user_id = ? and login_key = ?',
    //logout
    updateUserLoginKeyNull: 'update user_keys set login_key = NULL',
    //add email get code record
    insertMailRecord: 'INSERT INTO mail_activation(mail,mail_key) VALUE (?,?) ON DUPLICATE KEY UPDATE mail_key = ?',
    queryMailRecord: 'select * from mail_activation where mail = ? and mail_key = ? and mail not in (select user_email from user_keys)',
    //account address
    addressList: `select a_id id,a_name name,a_phone phone, a_street_address street_address,
        a_label label, a_city city, a_country country, a_state state, a_postal_code postal_code
        from address where u_id = ? `,
    addressDel: `delete from address where a_id = ? and u_id = ? `,
    addressAdd: `insert into address(
    a_id,
    a_label,
    a_name,
    a_phone,
    a_city,
    a_state,
    a_country,
    a_postal_code,
    a_street_address,
    u_id
    ) VALUES(?,?,?,?,?,?,?,?,?,?)`,
    addressUpdate: `
        update address set 
        a_label = ?, a_name = ?, a_phone = ?, a_city = ?, a_state = ?, a_country = ?,
        a_postal_code = ?, a_street_address = ?
        where u_id = ? and a_id = ?
    `,
    queryAddressDefault: `select user_address address from user_keys where user_id = ? `,
    queryAddressById: `
        select a_label label, a_name name, a_phone phone, a_street_address street_address, 
        a_city city, a_country country, a_state state, a_postal_code postal_code
        from address where a_id = ? and u_id = ?
    `,
    updateAddressDefault: `update user_keys set user_address = ? where user_id = ? `,

}

// let add;
// dateInit();

module.exports = {
    rsa,
    add,
    queryById,
    login,
    logout,
    getActivateMailCode,
    checkMailForUpdate,
    updateUser,
    checkLogin,
    addressList,
    addressDel,
    addressAdd,
    addressEdit,
    setAddressDefault
};

function rsa(req, res, next) {
    let rsa = encryptKey(SCRIPT);
    $uresp.resp($CONST.RSA, req, res, null, rsa);
}
/**
 * register
 */
function add(req, res, next) {
    let {
        name,
        email,
        password,
        mail_code
    } = req.body;
    name = decryptRsa(name);
    email = decryptRsa(email);
    password = decryptRsa(password);
    mail_code = decryptRsa(mail_code);
    let id = $util.creatUserId();
    checkActivateMailCode(req, mail_code, email, () => {
        $dao.doQuery(sqls.insertUser, [id, name, email, password], (err, result) => {
            if (result.affectedRows == 1) {
                result = [{
                    user_id: id,
                    user_email: email,
                    user_name: name,
                }];
                login(req, res, next);
            } else {
                $uresp.resp($uresp.CODE.USER_REGISTER, req, res, err, []);
            }
        });
    }, () => {
        $uresp.resp($uresp.CODE.USER_REGISTER_CODE_WRONG, req, res, null, null);
    });

}

function checkActivateMailCode(req, mail_code, email, succeed, failed) {
    $dao.doQuery(sqls.queryMailRecord, [email, mail_code], (err, result) => {
        if (result[0]) {
            succeed(result[0]);
        } else {
            failed();
        }
    });
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
    email = decryptRsa(email);
    password = decryptRsa(password);
    if (!($util.checkEmail(email) && $util.checkPwd(password))) {
        $uresp.resp($uresp.CODE.USER_LOGIN, req, res, err, []);
    }
    //check email an pwd
    $dao.doQuery(sqls.queryByEmailAndPwd, [email, password], (err, result) => {
        if (result.length > 0) {
            let id = result[0].user_id;
            let key = $util.creatLoginKey(id);
            //add loginrecord
            $dao.doQuery(sqls.addLoginRecord, [id, key], (_err, _result) => {
                if (!_result.affectedRows) {
                    $uresp.resp($uresp.CODE.USER_LOGIN, req, res, err, []);
                } else {
                    //update user login_key
                    $dao.doQuery(sqls.updateUserLoginKey, [key, id], (__err, __result) => {
                        if (!_result.affectedRows) {
                            result = [];
                        } else {
                            result[0].login_key = key;
                        }
                        $uresp.resp($uresp.CODE.USER_LOGIN, req, res, err, result);
                    });
                }
            });
        } else {
            $uresp.resp($uresp.CODE.USER_LOGIN, req, res, err, result);
        }
    });
}

function logout(req, res, next) {
    $dao.doQuery(sqls.updateUserLoginKeyNull, [], (err, result) => {
        $uresp.resp($uresp.CODE.USER_LOGOUT, req, res, null, null);
    });
}
/** 
 * 邮箱激活
 */
function getActivateMailCode(req, res, next) {
    let {
        email
    } = req.body;
    email = decryptRsa(email);
    let mail_time = moment(new Date().getTime() - 60 * 1000).format("YYYY-MM-DD HH:mm:ss");
    console.log(mail_time);
    // 检验邮箱
    $dao.doQuery(sqls.queryEmailForCheckMail, [mail_time, email, email], (err, result) => {
        if (result.length > 0) {
            $uresp.resp($uresp.CODE.USER_CHECK_EMAIL_ONLY, req, res, err, result);
        } else {
            let code = Math.ceil(Math.random() * 1000000);
            var mail = {
                // 主题
                subject: SUBJECT.getActivateCode,
                // 收件人
                to: email,
                // 邮件内容，HTML格式
                text: TEXT.getActivateCode(code) //接收激活请求的链接
            };
            send(mail, info => {
                // send succeed
                $dao.doQuery(sqls.insertMailRecord, [email, code, code], (err, _result) => {
                    // console.log(_result);
                    $uresp.resp($uresp.CODE.USER_GET_MAIL_ACTIVATE_CODE, req, res, null, {
                        code,
                        email
                    });
                });
            }, error => {
                // send failed
                $uresp.resp($uresp.CODE.USER_GET_MAIL_ACTIVATE_CODE, req, res, null, null);
            });
        }
    });
}


function checkMailForUpdate(req, res, next) {
    getActivateMailCode(req, res, next);
}

function updateUser(req, res, next) {
    //首先要验证
    //根据id以及key 更新内容
    let {
        name,
        email,
        password,
        mail_code,
    } = req.body;


    checkLogin(req, res, next, (user) => {
        name = name ? decryptRsa(name) : user.user_name;
        email = email ? decryptRsa(email) : user.user_email;
        password = password ? decryptRsa(password) : user.user_password;
        mail_code = mail_code ? decryptRsa(mail_code) : null;
        let sql_code = mail_code ? `MAIL IN (SELECT MAIL FROM MAIL_ACTIVATION WHERE MAIL_KEY = '${mail_code}') AND` : ""
        let sql = `UPDATE USER_KEYS SET USER_NAME = '${name}', USER_EMAIL = '${email}', USER_PASSWORD = '${password}' 
        WHERE ${sql_code} USER_ID = '${id}' AND LOGIN_KEY = '${key}'`;
        $dao.doQuery(sql, [], (err, result) => {
            if (result.affectedRows) {
                //update success
                let _user = {};
                _user.user_email = email;
                _user.user_name = name;
                $uresp.resp($uresp.CODE.USER_UPDATE, req, res, err, [_user]);
            } else {
                //update failed
                $uresp.resp($uresp.CODE.USER_UPDATE, req, res, err, []);
            }
        });
    });

}
/**
 *check login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} succeed
 */
function checkLogin(req, res, next, succeed) {
    let {
        id,
        key
    } = req.body;
    id = decryptRsa(id);
    key = decryptRsa(key);
    $dao.doQuery(sqls.queryUserLogin, [id, key], (err, result) => {
        if (result.length > 0) {
            succeed(result[0]);
        } else {
            $uresp.resp($uresp.CODE.USER_LOGIN_STATE_NONE, req, res, null, []);
        }
    });
}


function addressList(req, res, next) {
    let {
        id
    } = req.body;
    checkLogin(req, res, next, (user) => {
        id = decryptRsa(id);
        $dao.doQuery(sqls.addressList, [id], (err, result) => {
            if (result && result.length >= 0) {
                $uresp.resp($uresp.CODE.USER_ADDRESS, req, res, err, result);
            } else {
                $uresp.resp("", req, res, err, undefined);
            }
        });
    });
}


function addressDel(req, res, next) {
    let {
        a_id,
    } = req.body;
    checkLogin(req, res, next, (user) => {
        a_id = decryptRsa(a_id);
        $dao.doQuery(sqls.addressDel, [a_id, user.user_id], (err, result) => {
            if (result) {
                $uresp.resp($uresp.CODE.USER_ADDRESS_DEL, req, res, err, result);
            } else {
                $uresp.resp("", req, res, err, undefined);
            }
        });
    });
}

function addressAdd(req, res, next) {
    checkLogin(req, res, next, (user) => {
        let {
            label,
            name,
            phone,
            city,
            state,
            country,
            postal_code,
            street_address
        } = req.body;

        label = decryptRsa(label),
            name = decryptRsa(name),
            phone = decryptRsa(phone),
            city = decryptRsa(city),
            state = decryptRsa(state),
            country = decryptRsa(country),
            postal_code = decryptRsa(postal_code),
            street_address = decryptRsa(street_address);

        $dao.doQuery(sqls.addressAdd, [$util.creatAddressId(), label, name, phone, city, state, country, postal_code, street_address, user.user_id], (err, result) => {
            if (result) {
                $uresp.resp($uresp.CODE.USER_ADDRESS_ADD, req, res, err, result);
            } else {
                $uresp.resp("", req, res, err, undefined);
            }
        });

    })

}

function addressEdit(req, res, next) {
    checkLogin(req, res, next, (user) => {
        let {
            a_id,
            label,
            name,
            phone,
            city,
            state,
            country,
            postal_code,
            street_address
        } = req.body;
        a_id = decryptRsa(a_id),
            label = decryptRsa(label),
            name = decryptRsa(name),
            phone = decryptRsa(phone),
            city = decryptRsa(city),
            state = decryptRsa(state),
            country = decryptRsa(country),
            postal_code = decryptRsa(postal_code),
            street_address = decryptRsa(street_address);

        $dao.doQuery(sqls.addressUpdate, [label, name, phone, city, state, country, postal_code, street_address, user.user_id, a_id], (err, result) => {
            if (result) {
                $uresp.resp($uresp.CODE.USER_ADDRESS_EDIT, req, res, err, result);
            } else {
                $uresp.resp("", req, res, err, undefined);
            }
        });

    })
}

function setAddressDefault(req, res, next) {
    checkLogin(req, res, next, (user) => {
        let {
            aid
        } = req.body;
        aid = decryptRsa(aid);
        $dao.doQuery(sqls.queryAddressById, [aid, user.user_id], (err, result) => {
            if (result) {
                let obj = {};
                let s = "";
                try {
                    obj = result[0];
                    s = JSON.stringify(obj);
                } catch (error) {
                    $uresp.resp("", req, res, err, []);
                    return;
                }
                $dao.doQuery(sqls.updateAddressDefault, [s,user.user_id], (err, _result) => {
                    $uresp.resp($uresp.CODE.USER_ADDRESS_DEFAULT, req, res, err, _result);
                });
            } else {
                $uresp.resp("", req, res, err, []);
            }
        });
    });
}