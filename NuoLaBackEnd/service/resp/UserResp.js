const CODE = {
    USER_REGISTER: "101",
    USER_LOGIN: "102",
    USER_LOGOUT: "103",
    USER_QUERY_BY_ID: "104",
    USER_GET_MAIL_ACTIVATE_CODE: "105",//get code success
    USER_CHECK_EMAIL_ONLY:"106",//response email not only
    USER_REGISTER_CODE_WRONG: "107",//code wrong
}
module.exports = {
    resp,
    CODE
}

function resp(resp_code, req, res, err, result) {
    let send_result;
    send_result = {
        result,
        service_code: resp_code
    };
    //resp_code == CODE.USER_QUERY_BY_ID
    switch (resp_code) {
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
    }

    if (typeof result === 'undefined') {
        // sql err
        console.log(err);
        res.json({
            errcode: 101,
            msg: "sql错误"
        });
    } else {
        console.log(send_result);
        res.json(send_result);
    }

}
// register
function register(res, err, result) {
    return {
        result,
        service_code: CODE.USER_REGISTER,
        service_msg: "USER_REGISTER"
    }
}
function emailCodeWrong(){
    return {
        result: [],
        service_code: CODE.USER_REGISTER_CODE_WRONG,
        service_msg: "USER_REGISTER_CODE_WRONG"
    }
}


// login
function login(req, res, err, result) {
    console.log("login:" + result);
    req.session.user_id = result[0]?result[0].user_id:null;
    return {
        result,
        service_code: CODE.USER_LOGIN
    }
}

function logout(req, res) {
    req.session.user_id = null;
    return {
        result: [],
        logout: "succeed",
        service_code: CODE.USER_LOGOUT,
    }
}


//activete 获取邮箱激活码 成功
function getActivateMailCode(req, result) {
    if(result){
        req.session.mail_code = result.code;
        req.session.email = result.email;
    }
    return {
        result:[],
        service_code: CODE.USER_GET_MAIL_ACTIVATE_CODE,
        service_msg: "USER_GET_MAIL_ACTIVATE_CODE"
    }
}
function checkEmailOnly(result) {
    return {
        result: [],
        service_code: CODE.USER_CHECK_EMAIL_ONLY,
        service_msg: "USER_CHECK_EMAIL_ONLY"
    }
}

