

const CODE = require("../../util/CONST");
let {
    encryptRsa
} = require("../../util/Encryption");
let {
    getResponseForUser
} = require('./Resp');
module.exports = {
    resp
}

function resp(resp_code, req, res, err, result) {
    let send_result;
    send_result = {
        result: encryptRsa(JSON.stringify(result)),
        service_code: encryptRsa(resp_code)
    };
    switch (resp_code) {
        case CODE.CART_ADD:
            send_result = addCart(res, err, result);
            break;
        case CODE.CART_ADD_NUMBER_ADD:
            send_result = addNum(res, err, result);
            break;
        case CODE.CART_NUM:
            send_result = num(res, err, result);
            break;
        case CODE.CART:
            send_result = cart(res, err, result);
            break;
        case CODE.CART_EDIT_NUM:
            send_result = editNum(res, err, result);
            break;
        case CODE.CART_DEL:
            send_result = del(res, err, result);
            break;
        case CODE.CART_NO_ADDRESS:
            send_result = noAddress(res, err, result);
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
function addCart(res, err, result) {
    return getResponseForUser(result,CODE.CART_ADD,"CART_ADD");
}
function addNum(res, err, result) {
    return getResponseForUser(result,CODE.CART_ADD_NUMBER_ADD,"CART_ADD_NUMBER_ADD");
}
function num(res, err, result) {
    return getResponseForUser(result,CODE.CART_NUM,"CART_NUM");
}
function cart(res, err, result) {
    return getResponseForUser(result,CODE.CART,"CART");
}
function editNum(res, err, result) {
    return getResponseForUser(result,CODE.CART_EDIT_NUM,"CART_EDIT_NUM");
}
function del(res, err, result) {
    return getResponseForUser(result,CODE.CART_DEL,"CART_DEL");
}
function noAddress(res, err, result) {
    return getResponseForUser(result,CODE.CART_NO_ADDRESS,"CART_NO_ADDRESS");
}
