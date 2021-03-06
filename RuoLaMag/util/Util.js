const uuid = require('node-uuid');
let CONST = require('./CONST');
let moment = require('moment')
let {
    decryptRsa
} = require("./Encryption");

module.exports = {
    mergeJsonObject,
    checkEmail,
    checkPwd,
    checkAccount,
    checkName,
    checkHash64,
    getUUID,
    creatLoginKey,
    creatUserId,
    creatOperationLogsId,
    //for sql
    getDescOrAsc,
    getLimit,
    //for body
    decryptBody,
    //for id
    getUserId,
    //
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
function checkName(name) {
    return /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/.test(name);
  }

  function checkHash64(hash) {
    return /^[0-9a-z]{64}$/.test(hash);
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



function ___replaceObj(old_obj) {
    if(old_obj["name"] === "a"){
        old_obj = ["a"];
    }else{
        for (let key in old_obj) {
            if (old_obj.hasOwnProperty(key) && old_obj[key] instanceof Object) {
                old_obj[key] = replaceObj(old_obj[key]);
            }
        }
    }
    return old_obj;
}

function getUserId(account) {
    return account + `_` + moment().format('YYYYMMDDHHmmss');
}
