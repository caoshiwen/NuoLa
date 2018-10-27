const uuid = require('node-uuid');
module.exports = {
    mergeJsonObject,
    checkEmail,
    checkPwd,
    getUUID,
    creatLoginKey,
    creatUserId,
    creatCartId,
    creatAddressId,
    getLimit,
    creatOrderId
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
    return !!email.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
}

function checkPwd(pwd) {
    return !!pwd.length;
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

function creatCartId() {
    return new Date().getTime() + getUUID();
}
function creatAddressId() {
    return new Date().getTime() + getUUID();
}
function creatOrderId() {
    return new Date().getTime() + getUUID();
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

