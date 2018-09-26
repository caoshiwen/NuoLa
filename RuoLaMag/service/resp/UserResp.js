const CODE = require("../../util/CONST");
let {
    encryptRsa
} = require("../../util/Encryption");
let {
    getResponseForUser
} = require('./Resp');
module.exports = {
    resp,
}

function resp(resp_code, req, res, err, result) {
    let send_result;
    send_result = {
        result: encryptRsa(JSON.stringify([])),
        service_code: encryptRsa(resp_code)
    };
    //resp_code == CODE.USER_QUERY_BY_ID
    switch (resp_code) {
        case CODE.RSA:
            send_result = rsa(result);
            break;
        case CODE.USER_LOGIN:
            send_result = login(req, res, err, result);
            break;
        case CODE.USER_LOGIN_STATUS_NONE:
            send_result = noLogin(result);
            break;
        case CODE.USER_LIST:
            send_result = userList(result);
            break;
        case CODE.NO_PERMISSION:
            send_result = noPermission();
            break;
        case CODE.USER_CHANGE_SATAE:
            send_result = changeState();
            break;
        case CODE.USER_CHANGE_SATAE_FAILED:
            send_result = changeStateFailed();
            break;
        //permission
        case CODE.PERMISSIONS: 
            send_result = permissions(result);
            break;
        case CODE.PERMISSION_ADD:
            send_result = permissionAdd();
            break;
        case CODE.PERMISSION_ADD_FAILED:
            send_result = permissionAddFailed();
            break;
        case CODE.PERMISSION_UPDATE:
            send_result = permissionUpdate();
            break;
        case CODE.PERMISSION_DELETE:
            send_result = permissionDelete();
            break;
        case CODE.PERMISSION_UPDATE_DESCRIBE:
            send_result = permissionDeleteFailed();
            break;

        case CODE.OPERATIONS: 
            send_result = operations(result);
            break;
        case CODE.OPERATION_ADD:
            send_result = operationAdd();
            break;
        case CODE.OPERATION_ADD_FAILED:
            send_result = operationAddFailed();
            break;
        case CODE.OPERATION_UPDATE:
            send_result = operationUpdate();
            break;
        case CODE.OPERATION_DELETE:
            send_result = operationDelete();
            break;
        case CODE.OPERATION_UPDATE_DESCRIBE:
            send_result = operationDeleteFailed();
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
// login
function login(req, res, err, result) {
    let code = CODE.USER_LOGIN_SUCCESS;
    if (!result.length) {
        code = CODE.USER_LOGIN_ERROR_PASSWORD;
    } else if (result[0].state) {
        code = CODE.USER_LOGIN_INACTIVE;
        result = [];
    }
    return getResponseForUser(result, code, "USER_LOGIN");

}
// checkLogin
function checkLogin(req, res, err) {
    let result = [];
    console.log(req.session.login_key)
    if (req.session.login_key) {
        result[0] = {};
        result[0].id = req.session.user_id;
        result[0].key = req.session.login_key;
    }
    return getResponseForUser(result, CODE.USER_CHECK_LOGIN, "USER_CHECK_LOGIN");
}


//noLogin
function noLogin(result) {
    return getResponseForUser(result, CODE.USER_LOGIN_STATUS_NONE, "USER_LOGIN_STATUS_NONE");
}

function userList(result) {
    console.log(JSON.stringify(result));
    return getResponseForUser(result, CODE.USER_LIST, "USER_LIST");
}

//nopermission
function noPermission() {
    return getResponseForUser([], CODE.NO_PERMISSION, "NO_PERMISSION");
}

function changeState() {
    return getResponseForUser([], CODE.USER_CHANGE_SATAE, "USER_CHANGE_SATAE");
}

function changeStateFailed() {
    return getResponseForUser([], CODE.USER_CHANGE_SATAE_FAILED, "USER_CHANGE_SATAE_FAILED");
}
//permission
function permissions(result) {
    console.log(JSON.stringify(result));
    return getResponseForUser(result, CODE.PERMISSIONS, "PERMISSIONS");
}

function permissionAdd() {
    return getResponseForUser([], CODE.PERMISSION_ADD, "PERMISSION_ADD");
}
function permissionAddFailed() {
    return getResponseForUser([], CODE.PERMISSION_ADD_FAILED, "PERMISSION_ADD_FAILED");
}
function permissionUpdate() {
    return getResponseForUser([], CODE.PERMISSION_UPDATE, "PERMISSION_UPDATE");
}
function permissionDelete() {
    return getResponseForUser([], CODE.PERMISSION_DELETE, "PERMISSION_DELETE");
}
function permissionDeleteFailed() {
    return getResponseForUser([], CODE.PERMISSION_DELETE_FAILED, "PERMISSION_DELETE_FAILED");
}

//operation
function operations(result) {
    console.log(JSON.stringify(result));
    return getResponseForUser(result, CODE.OPERATIONS, "OPERATIONS");
}
function operationAdd() {
    return getResponseForUser([], CODE.OPERATION_ADD, "OPERATION_ADD");
}
function operationAddFailed() {
    return getResponseForUser([], CODE.OPERATION_ADD_FAILED, "OPERATION_ADD_FAILED");
}
function operationUpdate() {
    return getResponseForUser([], CODE.OPERATION_UPDATE, "OPERATION_UPDATE");
}
function operationDelete() {
    return getResponseForUser([], CODE.OPERATION_DELETE, "OPERATION_DELETE");
}
function operationDeleteFailed() {
    return getResponseForUser([], CODE.OPERATION_DELETE_FAILED, "OPERATION_DELETE_FAILED");
}