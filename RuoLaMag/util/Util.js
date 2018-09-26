const uuid = require('node-uuid');
let CONST = require('./CONST');
let {
    decryptRsa
} = require("./Encryption");

module.exports = {
    mergeJsonObject,
    checkEmail,
    checkPwd,
    checkAccount,
    getUUID,
    creatLoginKey,
    creatUserId,
    creatOperationLogsId,
    //for sql
    getDescOrAsc,
    getLimit,
    //for body
    decryptBody
}


/**
 * merge two json objects into one
 * @param {JSONObject} des 
 * @param {JSONObject,Array} src 
 * @param {Boolean} overwrite 
 */
function mergeJsonObject (des, src, overwrite) {
    let re = {};
    for (let key in des) {
        re[key] = des[key];
    }
    for (let key in src) {
        if(overwrite || !(key in re)) {
            re[key] = src[key];
        }
    }
}

function checkEmail(email) {
    return !!email.match(CONST.REGFOREMAIL);
}

function checkPwd(pwd) {
    return !!pwd.match(CONST.REGFORPASSWORD);
}

function checkAccount(account) {
    return !!account.match(CONST.REGFORACCOUNT);
}


/**
 * uuid: The only code
 * @returns String
 */
function getUUID() {
    return uuid.v1().replace(/-/g, "");
}

function creatLoginKey(id) {
    return getUUID();
}

function creatUserId() {
    return new Date().getTime() + getUUID();
}

function creatOperationLogsId() {
    return new Date().getTime() + getUUID();
}


//about sql
/**
 *
 *
 * @param {string} word
 * @returns "ASC" OR "DESC"
 */
function getDescOrAsc(order, prop){
    return order.toUpperCase()==="ASCENDING" ? ` ORDER BY ${prop} ASC`: ` ORDER BY ${prop} DESC`
}
/**
 * 
 * @param {string} num
 * @param {string} size
 * @returns 'limit pagestart,pageend' 
 */
function getLimit(num, size) {
    num = parseInt(num);
    size = parseInt(size);
    return ` limit ${(num-1)*size},${size}`;
}


function decryptBody(body,next) {
    try {
        for (let key in body) {
            if (body.hasOwnProperty(key)) {
                body[key] = decryptRsa(body[key]);
            }
        }
        return body;
    } catch (error) {
        next();
        return {};
    }

}