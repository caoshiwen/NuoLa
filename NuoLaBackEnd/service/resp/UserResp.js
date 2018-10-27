

const CODE = require("../../util/CONST");
let {
    encryptRsa
} = require("../../util/Encryption");
let {
    getResponseForUser
} = require('./Resp');
module.exports = {
    resp,
    CODE
}

function resp(resp_code, req, res, err, result) {
    let send_result;
    send_result = {
        result: encryptRsa(JSON.stringify(result)),
        service_code: encryptRsa(resp_code)
    };
    //resp_code == CODE.USER_QUERY_BY_ID
    switch (resp_code) {
        case CODE.RSA:
            send_result = rsa(result)
            break;
        case CODE.USER_REGISTER:
            send_result = register(res, err, result);
            break;
        case CODE.USER_LOGIN:
            send_result = login(req, res, err, result);
            break;
        case CODE.USER_LOGOUT:
            send_result = logout(req, res);
            break;
        case CODE.USER_QUERY_BY_ID:
            break;
        case CODE.USER_GET_MAIL_ACTIVATE_CODE:
            send_result = getActivateMailCode(req, result);
            break;
        case CODE.USER_CHECK_EMAIL_ONLY:
            send_result = checkEmailOnly(result);
            break;
        case CODE.USER_REGISTER_CODE_WRONG:
            send_result = emailCodeWrong();
            break;
        case CODE.USER_LOGIN_STATE_NONE:
            send_result = noLogin();
            break;
        case CODE.USER_UPDATE:
            send_result = update(result);
            break;
        case CODE.USER_ADDRESS:
            send_result = addressList(result);
            break;
        case CODE.USER_ADDRESS_DEL:
            send_result = addressDel(result);
            break;
        case CODE.USER_ADDRESS_ADD:
            send_result = addressAdd(result);
            break;
        case CODE.USER_ADDRESS_EDIT:
            send_result = addressEdit(result);
            break;
        case CODE.USER_ADDRESS_DEFAULT: 
            send_result = setAddressDefault(result);
            break;
    }

    if (typeof result === 'undefined') {
        // sql err
        console.log(err);
        res.json({
            errcode: 101,
            msg: "sql错误"
        });
    } else {
        res.json(send_result);
    }

}
function rsa(rsa) {
    return {
        rsa
    }
}
// register
function register(res, err, result) {
    return getResponseForUser(result,CODE.USER_REGISTER,"USER_REGISTER");
}
function emailCodeWrong(){
    return getResponseForUser([],CODE.USER_REGISTER_CODE_WRONG,"USER_REGISTER_CODE_WRONG");
}


// login
function login(req, res, err, result) {
    req.session.user_id = result[0]?result[0].user_id:null;
    req.session.login_key = result[0]?result[0].login_key:null;
    return getResponseForUser(result, CODE.USER_LOGIN, "USER_LOGIN");
}

function logout(req, res) {
    req.session.user_id = null;
    req.session.login_key = null;
    return getResponseForUser([], CODE.USER_LOGOUT, "USER_LOGOUT");
}

function noLogin() {
    return getResponseForUser([], CODE.USER_LOGIN_STATE_NONE, "USER_LOGIN_STATE_NONE");
}


//activete 获取邮箱激活码 成功
function getActivateMailCode(req, result) {
    if(result){
        result = [{user_email: result.email}];
    }else{
        result = [];
    }
    return getResponseForUser(result, CODE.USER_GET_MAIL_ACTIVATE_CODE, "USER_GET_MAIL_ACTIVATE_CODE");
}
function checkEmailOnly(result) {
    return getResponseForUser([], CODE.USER_CHECK_EMAIL_ONLY, "USER_CHECK_EMAIL_ONLY");
}


//update
function update(result) {
    return getResponseForUser(result, CODE.USER_UPDATE, "USER_UPDATE");
}

function addressList(result) {
    return getResponseForUser(result, CODE.USER_ADDRESS, "USER_ADDRESS");
}

function addressDel(result) {
    return getResponseForUser(result, CODE.USER_ADDRESS_DEL, "USER_ADDRESS_DEL");
}
function addressAdd(result) {
    return getResponseForUser(result, CODE.USER_ADDRESS_ADD, "USER_ADDRESS_ADD");
}
function addressEdit(result) {
    return getResponseForUser(result, CODE.USER_ADDRESS_EDIT, "USER_ADDRESS_EDIT");
}

function setAddressDefault(result) {
    return getResponseForUser(result, CODE.USER_ADDRESS_DEFAULT, "USER_ADDRESS_DEFAULT");
}