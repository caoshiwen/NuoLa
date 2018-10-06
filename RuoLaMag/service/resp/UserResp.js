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
        case CODE.USER_ADD:
            send_result = userAdd(result);
            break;
        case CODE.USER_ADD_FAILED:
            send_result = userAddFailed(result);
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
            //operation
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
        case CODE.OPERATION_DELETE_FAILED:
            send_result = operationDeleteFailed();
            break;
            //userpower
        case CODE.USERPOWERS:
            send_result = userpowers(result);
            break;
        case CODE.USERPOWER_ADD:
            send_result = userpowerAdd();
            break;
        case CODE.USERPOWER_ADD_FAILED:
            send_result = userpowerAddFailed();
            break;
        case CODE.USERPOWER_UPDATE:
            send_result = userpowerUpdate();
            break;
        case CODE.USERPOWER_DELETE:
            send_result = userpowerDelete();
            break;
        case CODE.USERPOWER_DELETE_FAILED:
            send_result = userpowerDeleteFailed();
            break;
        case CODE.USERS_ALL:
            send_result = userAll(result);
            break;
        case CODE.PERMISSIONS_ALL:
            send_result = permissionAll(result);
            break;
        //operationpower
        case CODE.OPERATIONPOWERS:
            send_result = operationpowers(result);
            break;
        case CODE.OPERATIONPOWER_ADD:
            send_result = operationpowerAdd();
            break;
        case CODE.OPERATIONPOWER_ADD_FAILED:
            send_result = operationpowerAddFailed();
            break;
        case CODE.OPERATIONPOWER_UPDATE:
            send_result = operationpowerUpdate();
            break;
        case CODE.OPERATIONPOWER_DELETE:
            send_result = operationpowerDelete();
            break;
        case CODE.OPERATIONPOWER_DELETE_FAILED:
            send_result = operationpowerDeleteFailed();
            break;
        case CODE.OPERATIONS_ALL:
            send_result = operationAll(result);
            break;
        //operation logs
        case CODE.OPERATION_LOGS:
            send_result = operationLogs(result);
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
    let msg = 'USER_LOGIN_SUCCESS';
    if (result.length == 0) {
        code = CODE.USER_LOGIN_ERROR_PASSWORD;
        msg = "USER_LOGIN_ERROR_PASSWORD";
    } else if (result[0] && result[0].state == 0) {
        code = CODE.USER_LOGIN_INACTIVE;
        msg = "USER_LOGIN_INACTIVE";
        result = [];
    }
    return getResponseForUser(result, code, msg);

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
    return getResponseForUser(result, CODE.USER_LIST, "USER_LIST");
}

function userAdd(result) {
    return getResponseForUser(result, CODE.USER_ADD, "USER_ADD");
}
function userAddFailed(result) {
    return getResponseForUser(result, CODE.USER_ADD_FAILED, "USER_ADD_FAILED");
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

//userpowers
function userpowers(result) {
    console.log(JSON.stringify(result));
    return getResponseForUser(result, CODE.USERPOWERS, "USERPOWERS");
}

function userpowerAdd() {
    return getResponseForUser([], CODE.USERPOWER_ADD, "USERPOWER_ADD");
}

function userpowerAddFailed() {
    return getResponseForUser([], CODE.USERPOWER_ADD_FAILED, "USERPOWER_ADD_FAILED");
}

function userpowerUpdate() {
    return getResponseForUser([], CODE.USERPOWER_UPDATE, "USERPOWER_UPDATE");
}

function userpowerDelete() {
    return getResponseForUser([], CODE.USERPOWER_DELETE, "USERPOWER_DELETE");
}

function userpowerDeleteFailed() {
    return getResponseForUser([], CODE.USERPOWER_DELETE_FAILED, "USERPOWER_DELETE_FAILED");
}

function userAll(result) {
    return getResponseForUser(result, CODE.USERS_ALL, "USERS_ALL");
}

function permissionAll(result) {
    return getResponseForUser(result, CODE.PERMISSIONS_ALL, "PERMISSIONS_ALL");
}

//operationpowers
function operationpowers(result) {
    console.log(JSON.stringify(result));
    return getResponseForUser(result, CODE.OPERATIONPOWERS, "OPERATIONPOWERS");
}

function operationpowerAdd() {
    return getResponseForUser([], CODE.OPERATIONPOWER_ADD, "OPERATIONPOWER_ADD");
}

function operationpowerAddFailed() {
    return getResponseForUser([], CODE.OPERATIONPOWER_ADD_FAILED, "OPERATIONPOWER_ADD_FAILED");
}

function operationpowerUpdate() {
    return getResponseForUser([], CODE.OPERATIONPOWER_UPDATE, "OPERATIONPOWER_UPDATE");
}

function operationpowerDelete() {
    return getResponseForUser([], CODE.OPERATIONPOWER_DELETE, "OPERATIONPOWER_DELETE");
}

function operationpowerDeleteFailed() {
    return getResponseForUser([], CODE.OPERATIONPOWER_DELETE_FAILED, "OPERATIONPOWER_DELETE_FAILED");
}

function operationAll(result) {
    return getResponseForUser(result, CODE.OPERATIONS_ALL, "OPERATIONS_ALL");
}

function operationLogs(result) {
    return getResponseForUser(result, CODE.OPERATION_LOGS, "OPERATION_LOGS");
}