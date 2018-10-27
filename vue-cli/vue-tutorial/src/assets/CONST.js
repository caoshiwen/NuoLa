const CONST = {}
const HOST = 'http://127.0.0.1:3000';
const SOURCE_HOST = 'http://127.0.0.1:3000/source/img/';
CONST.HOST = HOST;
CONST.SOURCE_HOST = SOURCE_HOST;
CONST.REGFOREMAIL = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

export default {
    ...CONST,
    USER_REGISTER: "101",
    USER_LOGIN: "102",
    USER_LOGOUT: "103",
    USER_QUERY_BY_ID: "104",
    USER_GET_MAIL_ACTIVATE_CODE: "105", //get code success
    USER_CHECK_EMAIL_ONLY: "106", //response email not only
    USER_REGISTER_CODE_WRONG: "107", //code wrong
    USER_LOGIN_STATE_NONE: "1024", //no login
    USER_UPDATE: "108",
    USER_ADDRESS: "109",
    USER_ADDRESS_DEL: "110",
    USER_ADDRESS_ADD: "111",
    USER_ADDRESS_EDIT: "112",
    USERS_ADDRESS_DEFAULT: "113",

    PRODUCT_TYPES: "201",
    PRODUCT_TYPES_ERROR: "2014",
    PRODUCT_LIST: "202",
    PRODUCT_DETAIL: "301",
    
    CART_ADD: "401",
    CART_ADD_NUMBER_ADD: "402",
    CART_NUM:　"403",
    CART: "404",
    CART_EDIT_NUM: "405",
    CART_DEL: "406",
    CART_NO_ADDRESS: "407",

    ORDER_ADD: "501",
    ORDER_ADD_FAULT: "5014",
    ORDER_LIST: "502",

}