

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
        case CODE.PRODUCT_TYPES:
            send_result = getTypes(res, err, result);
            break;
        case CODE.PRODUCT_TYPES_ERROR:
            send_result = getTypesError();
            break;
        case CODE.PRODUCT_LIST:
            send_result = getList(result);
            break;
        case CODE.PRODUCT_DETAIL:
            send_result = getDetail(result);
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
function getTypes(res, err, result) {
    // let r = {};
    // for (const key in result) {
    //     if (result.hasOwnProperty(key)) {
    //         const element = result[key];
    //         if(!r.hasOwnProperty(element.type)){
    //             r[element.type] = [];
    //         }
    //         r[element.type].push(element.name);
    //     }
    // }
    return getResponseForUser(result,CODE.PRODUCT_TYPES,"PRODUCT_TYPES");
}
function getTypesError() {
    return getResponseForUser([],CODE.PRODUCT_TYPES_ERROR,"PRODUCT_TYPES_ERROR");
}
function getList(result) {
    return getResponseForUser(result,CODE.PRODUCT_LIST,"PRODUCT_LIST");
}
function getDetail(result) {
    return getResponseForUser(result,CODE.PRODUCT_DETAIL,"PRODUCT_DETAIL");
}