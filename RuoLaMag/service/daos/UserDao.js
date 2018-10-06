let $dao = require("./Dao"),
    $uresp = require("../resp/UserResp"),
    $util = require("../../util/Util"),
    $CONST = require("../../util/CONST")
    moment = require("moment"), 
    {
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
    ADDUSER: `INSERT INTO mag_users(mag_user_account,mag_user_name,mag_user_password,mag_user_id) VALUES(?,?,?,?) 
    ON DUPLICATE KEY UPDATE mag_user_name = ?,mag_user_password = ?`,
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
    PERMISSIONS: 'SELECT mag_permission_id id,mag_permission_describe _describe FROM mag_permissions WHERE mag_permission_id <> "1"',
    PERMISSIONSTOTAL: 'SELECT COUNT(*) AS total FROM mag_permissions WHERE mag_permission_id <> "1"',
    ADDPERMISSION: 'INSERT mag_permissions(mag_permission_id, mag_permission_describe) VALUES(?,?) ON DUPLICATE KEY UPDATE mag_permission_describe = ?',
    DELETEPERMISSION: 'DELETE FROM mag_permissions WHERE mag_permission_id = ?',
    //operation
    OPERAITONS: 'SELECT mag_transaction_id id,mag_transaction_describe _describe FROM mag_transactions',
    OPERAITONSTOTAL: 'SELECT COUNT(*) AS total FROM mag_transactions',
    ADDOPERATION: 'INSERT mag_transactions(mag_transaction_id, mag_transaction_describe) VALUES(?,?) ON DUPLICATE KEY UPDATE mag_transaction_describe = ?',
    DELETEOPERATOIN: 'DELETE FROM mag_transactions WHERE mag_transaction_id = ?',
    //userpower
    USERPOWERS: `SELECT u.mag_user_name name, u.mag_user_account account,
    p.mag_permission_id id, p.mag_permission_describe _describe from mag_user_permissions up 
    inner join mag_users u on up.mag_user_permission_user_id = u.mag_user_id and u.mag_user_id <> '1' 
    inner join mag_permissions p on up.mag_user_permission_permission_id = p.mag_permission_id `,
    USERPOWERSTOTAL: `SELECT COUNT(*) total from mag_user_permissions up 
    inner join mag_users u on up.mag_user_permission_user_id = u.mag_user_id and u.mag_user_id <> '1' 
    inner join mag_permissions p on up.mag_user_permission_permission_id = p.mag_permission_id`,
    DELETEUSERPOWER: `DELETE FROM mag_user_permissions WHERE 
    mag_user_permissions.mag_user_permission_user_id IN (SELECT mag_user_id FROM mag_users WHERE mag_user_account = ?) 
    AND mag_user_permissions.mag_user_permission_permission_id = ?`,
    ADDUSERPOWER: `INSERT mag_user_permissions(mag_user_permission_permission_id,mag_user_permission_user_id) 
    VALUES( ? ,(SELECT mag_user_id FROM mag_users WHERE mag_user_account = ? ))`,
    //operationpower
    OPERATIONPOWERS: `SELECT o.mag_transaction_id oid, o.mag_transaction_describe o_describe,
    p.mag_permission_id pid, p.mag_permission_describe p_describe from mag_transaction_permissions op
    inner join mag_transactions o on op.mag_transaction_permission_transaction_id = o.mag_transaction_id
    inner join mag_permissions p on op.mag_transaction_permission_permission_id = p.mag_permission_id`,
    OPERATIONPOWERSTOTAL:`SELECT COUNT(*) total from mag_transaction_permissions op
    inner join mag_transactions o on op.mag_transaction_permission_transaction_id = o.mag_transaction_id
    inner join mag_permissions p on op.mag_transaction_permission_permission_id = p.mag_permission_id`,
    DELETEOPERATIONPOWER: `DELETE FROM mag_transaction_permissions WHERE 
    mag_transaction_permissions.mag_transaction_permission_transaction_id = ? AND mag_transaction_permissions.mag_transaction_permission_permission_id = ?`,
    ADDOPERATIONPOWER: `INSERT mag_transaction_permissions(mag_transaction_permission_permission_id,mag_transaction_permission_transaction_id) 
    VALUES(? , ?)`,
    OPERATIONLOGS:`SELECT u.mag_user_account account, o.mag_transaction_id oid, DATE_FORMAT(ol.mag_operation_log_time,'%Y-%m-%d %H:%i:%S') time, ol.mag_operation_log_describe _describe 
    from mag_operation_logs ol
    inner join mag_transactions o on ol.mag_operation_log_transaction_id = o.mag_transaction_id 
    inner join mag_users u on ol.mag_operation_log_user_id =  u.mag_user_id `,
    OPERATIONLOGSTOTAL:`SELECT COUNT(*) total
    from mag_operation_logs ol
    inner join mag_transactions o on ol.mag_operation_log_transaction_id = o.mag_transaction_id 
    inner join mag_users u on ol.mag_operation_log_user_id =  u.mag_user_id `,
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
    addUser,
    banUser,
    permissions,
    addPermission,
    deletePermission,
    operations,
    addOperation,
    deleteOperation,
    userpowers,
    addUserpower,
    deleteUserpower,
    allUsers,
    allPermissions,
    operationpowers,
    addOperationpower,
    deleteOperationpower,
    allOperations,
    operationLogs,
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
    $dao.doQuery(sqls.USERLIST + order_by + ", mag_user_id " + limit, [], (err, result) => {
        $dao.doQuery(sqls.TOTAL, [], (_err, _result) => {
            try {
                if(result[0]){
                    result[0].total = _result[0].total;
                }
                addOperationRecord(req,$CONST.USER_LIST, $CONST.USER_LIST_DESCRIBE);
                $uresp.resp($CONST.USER_LIST, req, res, err, result);
            } catch (error) {
                console.log(error)
                next();
            }
        });
    });
}


function addUser(req, res, next) {
    checkPermission(req, res, $CONST.USER_ADD, () => {
        _addUser(req, res, next);
    }, next);
}
function _addUser(req, res, next) {
    let {
        account,
        name,
        password
    } = req.body;
    let body = $util.decryptBody({
        account,
        name,
        password
    },next);
    let params = [body.account, $util.getUserId(body.account) , body.name, body.password,];
    let sql = `INSERT INTO mag_users(mag_user_account,mag_user_id,mag_user_name,mag_user_password) VALUES(?,?,?,?) 
    ON DUPLICATE KEY UPDATE `;
    if(body.name!=$CONST.NONE && $util.checkName(body.name)){
        sql += " mag_user_name = ? ";
        params.push(body.name);
    }
    if(body.password!=$CONST.NONE && $util.checkHash64(body.password)){
        sql += params.length==5?",":"" +" mag_user_password = ? ";
        params.push(body.password);
    }
    console.log(sql);
    console.log(params);
    $dao.doQuery(sql, params, (err, result) => {
        if (result && result.affectedRows) {
            addOperationRecord(req,$CONST.USER_ADD, `${$CONST.USER_ADD_DESCRIBE},姓名:${body.name},账号:${body.account}`);
            $uresp.resp($CONST.USER_ADD, req, res, err, []);
        } else {
            $uresp.resp($CONST.USER_ADD_FAILED, req, res, err, []);
        }
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
    $dao.doQuery(sqls.PERMISSIONS + order_by + ", id " + limit, [], (err, result) => {
        $dao.doQuery(sqls.PERMISSIONSTOTAL, [], (_err, _result) => {
            try {
                if(result[0]){
                    result[0].total = _result[0].total;
                }
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
    $dao.doQuery(sqls.OPERAITONS + order_by + ", id " + limit, [], (err, result) => {
        $dao.doQuery(sqls.OPERAITONSTOTAL, [], (_err, _result) => {
            try {
                if(result[0]){
                    result[0].total = _result[0].total;
                }
                addOperationRecord(req, $CONST.OPERATIONS, $CONST.OPERATIONS_DESCRIBE);
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


/**
 * userpower list
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
function userpowers(req, res, next) {
    checkPermission(req, res, $CONST.USERPOWERS, () => {
        _userpowers(req, res, next);
    }, next);
}
function _userpowers(req, res, next) {
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
    $dao.doQuery(sqls.USERPOWERS + order_by + ", mag_user_id " + limit, [], (err, result) => {
        $dao.doQuery(sqls.USERPOWERSTOTAL, [], (_err, _result) => {
            try {
                if(result[0]){
                    result[0].total = _result[0].total;
                }
                addOperationRecord(req,$CONST.USERPOWERS, $CONST.USERPOWERS_DESCRIBE);
                $uresp.resp($CONST.USERPOWERS, req, res, err, result);
            } catch (error) {
                console.log(error);
                next();
            }
        });
    });
    
}
//add userpower
function addUserpower(req, res, next) {
    checkPermission(req, res, $CONST.OPERATION_ADD, () => {
        _addUserpower(req, res, next);
    }, next);
}
function _addUserpower(req, res, next) {
    let {
        key,
        id,
        account
    } = req.body;
    let body = $util.decryptBody({
        key,
        id,
        account
    },next);
    $dao.doQuery(sqls.ADDUSERPOWER, [body.id, body.account], (err, result) => {
        console.log(result);
        if (result&&result.affectedRows) {
            addOperationRecord(req,$CONST.USERPOWER_ADD, `${$CONST.USERPOWER_ADD_DESCRIBE},id:${body.id},account:${body.account}`);
            $uresp.resp($CONST.USERPOWER_ADD, req, res, err, []);
        } else {
            $uresp.resp($CONST.USERPOWER_ADD_FAILED, req, res, err, []);
        }
    });
}
//delete userpower
function deleteUserpower(req, res, next) {
    checkPermission(req, res, $CONST.USERPOWER_DELETE, () => {
        _deleteUserpower(req, res, next);
    }, next);
}
function _deleteUserpower(req, res, next) {
    let {
        key,
        id,
        account
    } = req.body;
    let body = $util.decryptBody({
        key,
        id,
        account
    },next);
    $dao.doQuery(sqls.DELETEUSERPOWER, [body.account,body.id], (err, result) => {
        let re = result.affectedRows >= 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.USERPOWER_DELETE, `${$CONST.USERPOWER_DELETE_DESCRIBE},权限id:${body.id},用户account:${body.account}`);
            $uresp.resp($CONST.USERPOWER_DELETE, req, res, err, []);
        } else {
            $uresp.resp($CONST.USERPOWER_DELETE_FAILED, req, res, err, []);
        }
    });
}
//all users
function allUsers(req, res, next) {
    checkPermission(req, res, $CONST.USERS_ALL, () => {
        _allUsers(req, res, next);
    }, next);
}
function _allUsers(req, res, next) {
    $dao.doQuery(sqls.USERLIST, [], (err, result) => {
        let re = result.length >= 1 ? true : false;
        if (re) {
            $uresp.resp($CONST.USERS_ALL, req, res, err, result);
        } else {
            $uresp.resp($CONST.USERS_ALL, req, res, err, []);
        }
    });
}
//all permissions
function allPermissions(req, res, next) {
    checkPermission(req, res, $CONST.PERMISSIONS_ALL, () => {
        _allPermissions(req, res, next);
    }, next);
}
function _allPermissions(req, res, next) {
    $dao.doQuery(sqls.PERMISSIONS, [], (err, result) => {
        let re = result.length >= 1 ? true : false;
        if (re) {
            $uresp.resp($CONST.PERMISSIONS_ALL, req, res, err, result);
        } else {
            $uresp.resp($CONST.PERMISSIONS_ALL, req, res, err, []);
        }
    });
}


/**
 * operationpower list
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
function operationpowers(req, res, next) {
    checkPermission(req, res, $CONST.OPERATIONPOWERS, () => {
        _operationpowers(req, res, next);
    }, next);
}
function _operationpowers(req, res, next) {
    let {
        current_page,
        order,
        page_size,
        prop
    } = req.body;
    let body = $util.decryptBody({
        current_page,
        order,
        page_size,
        prop
    },next); 
    let limit = $util.getLimit(body.current_page, body.page_size);
    let order_by = $util.getDescOrAsc(body.order, body.prop);
    $dao.doQuery(sqls.OPERATIONPOWERS + order_by + ", mag_transaction_id " + limit, [], (err, result) => {
        $dao.doQuery(sqls.OPERATIONPOWERSTOTAL, [], (_err, _result) => {
            try {
                if(result[0]){
                    result[0].total = _result[0].total;
                }
                addOperationRecord(req,$CONST.OPERATIONPOWERS, $CONST.OPERATIONPOWERS_DESCRIBE);
                $uresp.resp($CONST.OPERATIONPOWERS, req, res, err, result);
            } catch (error) {
                console.log(error);
                next();
            }
        });
    });
    
}
//add userpower
function addOperationpower(req, res, next) {
    checkPermission(req, res, $CONST.OPERATIONPOWER_ADD, () => {
        _addOperationpower(req, res, next);
    }, next);
}
function _addOperationpower(req, res, next) {
    let {
        key,
        oid,
        pid,
    } = req.body;
    let body = $util.decryptBody({
        key,
        oid,
        pid
    },next);
    $dao.doQuery(sqls.ADDOPERATIONPOWER, [body.pid, body.oid], (err, result) => {
        console.log(result);
        if (result&&result.affectedRows) {
            addOperationRecord(req,$CONST.OPERATIONPOWER_ADD, `${$CONST.OPERATIONPOWER_ADD_DESCRIBE},oid:${body.oid},pid:${body.pid}`);
            $uresp.resp($CONST.OPERATIONPOWER_ADD, req, res, err, []);
        } else {
            $uresp.resp($CONST.OPERATIONPOWER_ADD_FAILED, req, res, err, []);
        }
    });
}
//delete userpower
function deleteOperationpower(req, res, next) {
    checkPermission(req, res, $CONST.OPERATIONPOWER_DELETE, () => {
        _deleteOperationpower(req, res, next);
    }, next);
}
function _deleteOperationpower(req, res, next) {
    let {
        key,
        oid,
        pid
    } = req.body;
    let body = $util.decryptBody({
        key,
        oid,
        pid
    },next);
    console.warn(sqls.DELETEOPERATIONPOWER.replace(/\?/, body.oid).replace(/\?/, body.pid));
    $dao.doQuery(sqls.DELETEOPERATIONPOWER, [body.oid,body.pid], (err, result) => {
        let re = result.affectedRows >= 1 ? true : false;
        if (re) {
            addOperationRecord(req,$CONST.OPERATIONPOWER_DELETE, `${$CONST.OPERATIONPOWER_DELETE_DESCRIBE},oid:${body.oid},pid:${body.pid}`);
            $uresp.resp($CONST.OPERATIONPOWER_DELETE, req, res, err, []);
        } else {
            $uresp.resp($CONST.OPERATIONPOWER_DELETE_FAILED, req, res, err, []);
        }
    });
}
//all operations
function allOperations(req, res, next) {
    checkPermission(req, res, $CONST.OPERATIONS_ALL, () => {
        _allOperations(req, res, next);
    }, next);
}
function _allOperations(req, res, next) {
    $dao.doQuery(sqls.OPERAITONS, [], (err, result) => {
        let re = result.length >= 1 ? true : false;
        if (re) {
            $uresp.resp($CONST.OPERATIONS_ALL, req, res, err, result);
        } else {
            $uresp.resp($CONST.OPERATIONS_ALL, req, res, err, []);
        }
    });
}

function operationLogs(req, res, next) {
    checkPermission(req, res, $CONST.OPERATIONS_ALL, () => {
        _operationLogs(req, res, next);
    }, next);
}
function _operationLogs(req, res, next) {
    let {
        current_page,
        order,
        page_size,
        prop,
        account,
        oid
    } = req.body;
    let body = $util.decryptBody({
        current_page,
        order,
        page_size,
        prop,
        account, 
        oid
    },next); 
    let limit = $util.getLimit(body.current_page, body.page_size);
    let order_by = $util.getDescOrAsc(body.order, body.prop);
    let filter = "where";
    let params = [];
    if(body.account != $CONST.NONE) {
        filter += " u.mag_user_account = ? ";
        params.push(body.account);
    }
    if(body.oid != $CONST.NONE) {
        filter += " o.mag_transaction_id = ? ";
        params.push(body.oid);
    }
    filter = filter === "where"? "": filter;
    $dao.doQuery(sqls.OPERATIONLOGS + filter + order_by + ", ol.mag_operation_log_id " + limit, params, (err, result) => {
        $dao.doQuery(sqls.OPERATIONLOGSTOTAL + filter , params, (_err, _result) => {
            try {
                if(result[0]){
                    result[0].total = _result[0].total;
                    console.log(result[0].time);
                    // for (let key in result) {
                    //     if (result.hasOwnProperty(key)) {
                    //         result[key].time = result[key].time.toString();
                            
                    //     }
                    // }
                    result.forEach(element => {
                        element.time = element.time.toString();
                    });
                    console.log(result[0].time);
                    
                }
                addOperationRecord(req,$CONST.OPERATION_LOGS, $CONST.OPERATION_LOGS_DESCRIBE);
                $uresp.resp($CONST.OPERATION_LOGS, req, res, err, result);
            } catch (error) {
                console.log(error);
                next();
            }
        });
    });
    
}