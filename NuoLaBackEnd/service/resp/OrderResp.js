

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
        case CODE.ORDER_ADD:
            send_result = addOrder(res, err, result);
            break;
        case CODE.ORDER_LIST:
            send_result = list(res, err, result);
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
function addOrder(res, err, result) {
    return getResponseForUser(result,CODE.ORDER_ADD,"ORDER_ADD");
}
function list(res, err, result){
    return getResponseForUser(result,CODE.ORDER_LIST,"ORDER_LIST");
}