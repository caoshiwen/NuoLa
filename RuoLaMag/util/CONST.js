const CONST = {}
CONST.SESSION_CONFIG_CROS = {
    emulateJSON: true,
    withCredentials: true
};
CONST.REGFOREMAIL = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
CONST.REGFORPASSWORD = /^([a-zA-Z0-9]|[._]){64}$/;
CONST.REGFORACCOUNT = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,18}$/;
module.exports = {
    RSA: "100",
    //user login
    USER_LOGIN: "101",
    USER_LOGIN_SUCCESS: "1012",
    USER_LOGIN_ERROR_PASSWORD: "1014",
    USER_LOGIN_INACTIVE: "1015",
    USER_CHECK_LOGIN: "102",
    USER_LOGIN_STATUS_NONE: "1024",
    USER_LOGIN_STATUS_NORMAL: "1022",
    //user permission
    NO_PERMISSION: "88",
    //user list
    USERS_ALL: "_103",
    USER_LIST: "103",
    USER_LIST_DESCRIBE: "查看管理员账号",
    USER_CHANGE_SATAE: "104",
    USER_CHANGE_SATAE_DESCRIBE: "更改用户状态",
    USER_CHANGE_SATAE_FAILED: "1044",
    //permissions
    PERMISSIONS_ALL: "_105",
    PERMISSIONS: "105",
    PERMISSIONS_DESCRIBE: '查看权限列表',
    PERMISSION_ADD: "106",
    PERMISSION_ADD_DESCRIBE: "添加权限",
    PERMISSION_ADD_FAILED: "1064",
    PERMISSION_UPDATE: "107",
    PERMISSION_UPDATE_DESCRIBE: "修改权限描述",
    PERMISSION_DELETE: "108",
    PERMISSION_DELETE_DESCRIBE: "删除权限",
    PERMISSION_DELETE_FAILED: "1084",
    //operations
    OPERATIONS_ALL: "_109",
    OPERATIONS: "109",
    OPERATIONS_DESCRIBE: "查看操作列表",
    OPERATION_ADD: "110",
    OPEARTION_ADD_DESCRIBE: "添加操作",
    OPERATION_ADD_FAILED: "1104",
    OPERATION_UPDATE: "111",
    OPERATION_UPDATE_DESCRIBE: "修改权限描述",
    OPERATION_DELETE: "112",
    OPERATION_DELETE_DESCRIBE: "删除权限",
    OPERATION_DELETE_FAILED: "1124",
    //userpower
    USERPOWERS: "113",
    USERPOWERS_DESCRIBE: "查看用户权限",
    USERPOWER_ADD: "114",
    USERPOWER_ADD_DESCRIBE: "分配用户权限",
    USERPOWER_ADD_FAILED: "115",
    USERPOWER_UPDATE: "116",
    USERPOWER_UPDATE_DESCRIBE: "修改用户权限",
    USERPOWER_DELETE: "117",
    USERPOWER_DELETE_DESCRIBE: "删除已分配的用户权限",
    USERPOWER_DELETE_FAILED: "1174",
    //operationpower
    OPERATIONPOWERS: "118",
    OPERATIONPOWERS_DESCRIBE: "查看用户权限",
    OPERATIONPOWER_ADD: "119",
    OPERATIONPOWER_ADD_DESCRIBE: "分配用户权限",
    OPERATIONPOWER_ADD_FAILED: "120",
    OPERATIONPOWER_UPDATE: "121",
    OPERATIONPOWER_UPDATE_DESCRIBE: "修改用户权限",
    OPERATIONPOWER_DELETE: "122",
    OPERATIONPOWER_DELETE_DESCRIBE: "删除已分配的用户权限",
    OPERATIONPOWER_DELETE_FAILED: "1224",
    ...CONST
}