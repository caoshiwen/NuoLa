module.exports = {
    getResponseForUser
}
let {
    encryptRsa
} = require("../../util/Encryption");
/**
 * 
 * @param {String} result
 * @param {String} code
 * @param {String} msg
 * @returns
 */
function getResponseForUser(result, code, msg) {
    console.log(result);
    return {
        result: encryptRsa(JSON.stringify(result)),
        service_code: encryptRsa(code),
        service_msg: encryptRsa(msg)
    }
}
