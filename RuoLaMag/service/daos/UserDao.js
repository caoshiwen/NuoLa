let $dao = require("./Dao"),
    $uresp = require("../resp/UserResp"),
    $util = require("../../util/Util"),
    $CONST = require("../../util/CONST")
moment = require("moment"), {
    decryptRsa,
    encryptKey,
    SCRIPT
} = require("../../util/Encryption");

const sqls = {
    LOGIN: 'SELECT mag_user_id,mag_user_name,mag_user_state FROM mag_users WHERE mag_user_account = ? AND mag_user_password = ?',
    //login record
    ADDLOGINRECORD: 'INSERT INTO mag_login_logs(mag_login_log_id,mag_login_log_ip,mag_login_log_time) VALUES(?,?,NOW())',
    //user list
    USERLIST: 'SELECT mag_user_name name,mag_user_account account,mag_user_state state FROM mag_users WHERE mag_user_id <> "1" ',
    //user account
    TOTAL: 'SELECT COUNT(*) AS total FROM mag_users WHERE mag_user_id <> "1" ',
    //check permission
    CHECKPERMISSION: `SELECT mag_user_permission_user_id FROM mag_user_permissions WHERE 
    (mag_user_permission_permission_id IN 
        (SELECT mag_transaction_permission_permission_id FROM mag_transaction_permissions WHERE mag_transaction_permission_transaction_id = ?) 
        OR mag_user_permission_permission_id = "1") AND mag_user_permission_user_id = ?`,
    //operation log
    ADDOPERATIONLOG: 'INSERT mag_operation_logs(mag_operation_log_id, mag_operation_log_user_id, mag_operation_log_transaction_id, mag_operation_log_describe) values(?,?,?,?)',
    //user state(status)
    CHANGEUSERSTATE: 'UPDATE mag_users set mag_user_state = ? WHERE mag_user_account = ? AND mag_user_id <> ?',
    //permission
    PERMISSIONS: 'SELECT mag_permission_id id,mag_permission_describe _describe FROM mag_permissions',
    PERMISSIONSTOTAL: 'SELECT COUNT(*) AS total FROM mag_permissions',
    ADDPERMISSION: 'INSERT mag_permissions(mag_permission_id, mag_permission_describe) VALUES(?,?) ON DUPLICATE KEY UPDATE mag_permission_describe = ?',
    DELETEPERMISSION: 'DELETE FROM mag_permissions WHERE mag_permission_id = ?',
    //operation
    OPERAITONS: 'SELECT mag_transaction_id id,mag_transaction_describe _describe FROM mag_transactions',
    OPERAITONSSTOTAL: 'SELECT COUNT(*) AS total FROM mag_transactions',
    ADDOPERATION: 'INSERT mag_transactions(mag_transaction_id, mag_transaction_describe) VALUES(?,?) ON DUPLICATE KEY UPDATE mag_transaction_describe = ?',
    DELETEOPERATOIN: 'DELETE FROM mag_transactions WHERE mag_transaction_id = ?',
    // TOTAL_2: 'SELECT FOUND_ROWS() AS total',



    insert: 'INSERT INTO user_keys(user_id, user_name, user_email, user_password) VALUES(?,?,?,?)',
    insertOrUpdate: 'INSERT INTO mail_activation(mail,mail_key) VALUE (?,?) ON DUPLICATE KEY UPDATE mail_key = ?',
    update: 'update user_keys set user_name = ? where user_id = ? and login_key = ?',
    delete: 'delete from user_keys where user_id=?',
    query: 'select * from user_keys where user_id=?',
    setNull: 'update user_keys set login_key = NULL',
}
module.exports = {
    login,
    checkPermission,
    addOperationRecord,
    list,
    banUser,
    permissions,
    addPermission,
    deletePermission,
    operations,
    addOperation,
    deleteOperation,
    rsa,
};

function rsa(req, res, next) {
    let rsa = encryptKey(SCRIPT);
    $uresp.resp($CONST.RSA, req, res, null, rsa);
}

function login(req, res, next) {
    let {
        account,
        password
    } = req.body;
    account = decryptRsa(account);
    password = decryptRsa(password);
    if (!($util.checkAccount(account) && $util.checkPwd(password))) {
        $uresp.resp($CONST.USER_LOGIN, req, res, null, []);
        return;
    }
    //check accout and pwd
    $dao.doQuery(sqls.LOGIN, [account, password], (err, result) => {
        if (result.length > 0) {
            let id = result[0].mag_user_id;
            let name = result[0].mag_user_name;
            let state = result[0].mag_user_state;
            let key = $util.creatLoginKey(id);
            let ip = req.ip;
            let user = {
                name,
                key,
                state
            };
            if (state === 1) {
                req.session.user = {
                    name,
                    key,
                    id
                };
                user = {
                    name,
                    key
                };
            }
            $uresp.resp($CONST.USER_LOGIN, req, res, err, [user]);
            //add login record
            $dao.doQuery(sqls.ADDLOGINRECORD, [id, ip], (_err, _result) => {
                console.log(`ADDLOGINRECORD'affectedRows:${_result.affectedRows}`);
            });
        } else {
            $uresp.resp($CONST.USER_LOGIN, req, res, err, []);
        }
    });
}

function checkLogin(req, res, key) {
    if (req.session.user && req.session.user.key == key) {
        return true;
    } else {
        $uresp.resp($CONST.USER_LOGIN_STATUS_NONE, req, res, null, []);
        return false
    }
}
/**
 * checkPermission
 *
 * @param {Request} req
 * @param {string} service_code
 * @param {Function} success
 */
function checkPermission(req, res, service_code, success, next) {
    let {
        key
    } = req.body;
    let body = $util.decryptBody({
        key
    },next);
    if (!checkLogin(req, res, body.key)) {
        return;
    }
    $dao.doQuery(sqls.CHECKPERMISSION, [service_code, req.session.user.id], (err, result) => {
        if (result.length > 0) {
            success();
        } else {
            $uresp.resp($CONST.NO_PERMISSION, req, res, err, []);
        }
    });
}

function addOperationRecord(req, service_code, describe) {
    let id = $util.creatOperationLogsId();
    $dao.doQuery(sqls.ADDOPERATIONLOG,
        [id,
            req.session.user.id,
            service_code,
            `操作用户名:${req.session.user.name};操作用户ID:${req.session.user.id};操作内容:${describe};`
        ], (err, result) => {
            console.log(`ADDOPERATIONLOG'affectedRows:${result.affectedRows}`);
        });
}


/**
 * user  list
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
function list(req, res, next) {
    checkPermission(req, res, $CONST.USER_LIST, () => {
        _list(req, res, next);
    }, next);
}

function _list(req, res, next) {
    let {
        current_page,
        order,
        page_size,
        prop,
        key
    } = req.body;
    let body = $util.decryptBody({
        current_page,
        order,
        page_size,
        prop,
        key
    },next);
    let limit = $util.getLimit(body.current_page, body.page_size);
    let order_by = $util.getDescOrAsc(body.order, body.prop);
    console.log(sqls.USERLIST + order_by + ", mag_user_id " + limit);
    $dao.doQuery(sqls.USERLIST + order_by + ", mag_user_id " + limit, [], (err, result) => {
        $dao.doQuery(sqls.TOTAL, [], (_err, _result) => {
            try {
                result[0].total = _result[0].total;
                addOperationRecord(req,$CONST.USER_LIST, $CONST.USER_LIST_DESCRIBE);
                $uresp.resp($CONST.USER_LIST, req, res, err, result);
            } catch (error) {
                console.log(error)
                next();
            }
        });
    });
}



/**
 * ban user or enable account
 * @param {request} req 
 * @param {response} res 
 * @param {*} next 
 */
function banUser(req, res, next) {
    checkPermission(req, res, $CONST.BAN_USER, () => {
        _banUser(req, res, next);
    },next);
}

function _banUser(req, res, next) {
    let {
        account,
        key,
        state
    } = req.body;
    let body = $util.decryptBody({
        account,
        key,
        state
    },next);

    $dao.doQuery(sqls.CHANGEUSERSTATE, [parseInt(body.state), body.account, req.session.user.id], (err, result) => {
        let re = result.affectedRows == 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.USER_CHANGE_SATAE, `${$CONST.USER_CHANGE_SATAE_DESCRIBE},${body.state==="0"?"禁用":"启用"},${body.account}`);
            $uresp.resp($CONST.USER_CHANGE_SATAE, req, res, err, []);
        } else {
            $uresp.resp($CONST.USER_CHANGE_SATAE_FAILED, req, res, err, []);
        }
    });
}


/**
 * permission list
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
function permissions(req, res, next) {
    checkPermission(req, res, $CONST.PERMISSIONS, () => {
        _permissions(req, res, next);
    }, next);
}
function _permissions(req, res, next) {
    let {
        current_page,
        order,
        page_size,
        prop,
        key
    } = req.body;
    let body = $util.decryptBody({
        current_page,
        order,
        page_size,
        prop,
        key
    },next);
    let limit = $util.getLimit(body.current_page, body.page_size);
    let order_by = $util.getDescOrAsc(body.order, body.prop);
    console.log(sqls.PERMISSIONS + order_by + limit);
    $dao.doQuery(sqls.PERMISSIONS + order_by + limit, [], (err, result) => {
        $dao.doQuery(sqls.PERMISSIONSTOTAL, [], (_err, _result) => {
            try {
                result[0].total = _result[0].total;
                addOperationRecord(req,$CONST.PERMISSIONS, $CONST.PERMISSIONS_DESCRIBE);
                $uresp.resp($CONST.PERMISSIONS, req, res, err, result);
            } catch (error) {
                console.log(error);
                next();
            }
        });
    });
}
//add permission
function addPermission(req, res, next) {
    checkPermission(req, res, $CONST.PERMISSION_ADD, () => {
        _addPermission(req, res, next);
    }, next);
}
function _addPermission(req, res, next) {
    let {
        key,
        id,
        _describe
    } = req.body;
    let body = $util.decryptBody({
        key,
        id,
        _describe
    },next);
    $dao.doQuery(sqls.ADDPERMISSION, [body.id, body._describe, body._describe], (err, result) => {
        let re = result.affectedRows >= 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.PERMISSION_ADD, `${$CONST.PERMISSION_ADD_DESCRIBE},id:${body.id},describe:${body._describe}`);
            $uresp.resp($CONST.PERMISSION_ADD, req, res, err, []);
        } else {
            $uresp.resp($CONST.PERMISSION_ADD_FAILED, req, res, err, []);
        }
    });
}
//delete permission
function deletePermission(req, res, next) {
    checkPermission(req, res, $CONST.PERMISSION_DELETE, () => {
        _deletePermission(req, res, next);
    }, next);
}
function _deletePermission(req, res, next) {
    let {
        key,
        id
    } = req.body;
    let body = $util.decryptBody({
        key,
        id
    },next);
    $dao.doQuery(sqls.DELETEPERMISSION, [body.id], (err, result) => {
        let re = result.affectedRows >= 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.PERMISSION_DELETE, `${$CONST.PERMISSION_DELETE_DESCRIBE},id:${body.id}`);
            $uresp.resp($CONST.PERMISSION_DELETE, req, res, err, []);
        } else {
            $uresp.resp($CONST.PERMISSION_DELETE_FAILED, req, res, err, []);
        }
    });
}

/**
 * operation list
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
function operations(req, res, next) {
    checkPermission(req, res, $CONST.OPERATIONS, () => {
        _operations(req, res, next);
    }, next);
}
function _operations(req, res, next) {
    let {
        current_page,
        order,
        page_size,
        prop,
        key
    } = req.body;
    let body = $util.decryptBody({
        current_page,
        order,
        page_size,
        prop,
        key
    },next); 
    let limit = $util.getLimit(body.current_page, body.page_size);
    let order_by = $util.getDescOrAsc(body.order, body.prop);
    console.log(sqls.OPERAITONS + order_by + limit);
    $dao.doQuery(sqls.OPERAITONS + order_by + limit, [], (err, result) => {
        $dao.doQuery(sqls.OPERAITONSSTOTAL, [], (_err, _result) => {
            try {
                result[0].total = _result[0].total;
                addOperationRecord(req,$CONST.OPERATIONS, $CONST.OPERATIONS_DESCRIBE);
                $uresp.resp($CONST.OPERATIONS, req, res, err, result);
            } catch (error) {
                console.log(error);
                next();
            }
        });
    });
}
//add operation
function addOperation(req, res, next) {
    checkPermission(req, res, $CONST.OPERATION_ADD, () => {
        _addOperation(req, res, next);
    }, next);
}
function _addOperation(req, res, next) {
    let {
        key,
        id,
        _describe
    } = req.body;
    let body = $util.decryptBody({
        key,
        id,
        _describe
    },next);
    $dao.doQuery(sqls.ADDOPERATION, [body.id, body._describe, body._describe], (err, result) => {
        let re = result.affectedRows >= 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.OPERATION_ADD, `${$CONST.OPERATION_ADD_DESCRIBE},id:${body.id},describe:${body._describe}`);
            $uresp.resp($CONST.OPERATION_ADD, req, res, err, []);
        } else {
            $uresp.resp($CONST.OPERATION_ADD_FAILED, req, res, err, []);
        }
    });
}
//delete operation
function deleteOperation(req, res, next) {
    checkPermission(req, res, $CONST.OPERATION_DELETE, () => {
        _deleteOperation(req, res, next);
    }, next);
}
function _deleteOperation(req, res, next) {
    let {
        key,
        id
    } = req.body;
    let body = $util.decryptBody({
        key,
        id
    },next);
    $dao.doQuery(sqls.DELETEOPERATOIN, [body.id], (err, result) => {
        let re = result.affectedRows >= 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.OPERATION_DELETE, `${$CONST.OPERATION_DELETE_DESCRIBE},id:${body.id}`);
            $uresp.resp($CONST.OPERATION_DELETE, req, res, err, []);
        } else {
            $uresp.resp($CONST.OPERATION_DELETE_FAILED, req, res, err, []);
        }
    });
}