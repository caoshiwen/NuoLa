let $dao = require("./Dao"),
    $cresp = require("../service/resp/CartResp"),
    $util = require("../util/Util"),
    $CONST = require("../util/CONST"),
    moment = require("moment"),
    UserDao = require("./UserDao"),
    {
        decryptRsa
    } = require("../util/Encryption");

const sqls = {
    ADD: `INSERT INTO cart(c_id,u_id,p_id,c_num,c_detail) VALUES(?,?,?,?,?) 
    ON DUPLICATE KEY UPDATE c_num = c_num + ? `,
    NUM: `SELECT COUNT(*) num FROM cart WHERE u_id = ? `,
    CART: `SELECT cart.c_id cid,cart.u_id uid,cart.p_id pid,p.p_img_src img,p.p_name name,pt.pt_name type,pt.pt_type pt_type,cart.c_detail others,cart.c_num num,p.p_price price 
    FROM cart
    inner join products p on p.p_id = cart.p_id
    inner join product_types pt on pt.pt_name = p.p_type
    where cart.u_id = ?
    `,
    CART_UPDATE_NUM: `UPDATE cart set c_num = ? where c_id = ? and u_id = ?`,
    CART_DEL: `delete from cart where c_id = ? and u_id = ?`,
    CART_QUERY_ADDRESS_DEFAULT: `select user_address address from user_keys where user_id = ? `,
}
module.exports = {
    add,
    num,
    products,
    cart,
    editNum,
    del
};

function add(req, res, next) {
    UserDao.checkLogin(req, res, next, (user) => {
        let {
            detail,
            pid,
            num
        } = req.body;
        try {
            detail = decryptRsa(detail);
            detail = JSON.parse(detail);
            detail = dealDetail(detail);
            num = decryptRsa(num);
            num = parseInt(num);
            pid = decryptRsa(pid);
        } catch (error) {
            console.log(error);
            next();
        }
        $dao.doQuery(sqls.ADD, [$util.creatCartId(), user.user_id, pid, num, detail, num], (err, result) => {
            if (result.affectedRows == 1) {
                $cresp.resp($CONST.CART_ADD, req, res, err, []);
            } else if (result.affectedRows == 2) {
                $cresp.resp($CONST.CART_ADD_NUMBER_ADD, req, res, err, []);
            } else {
                next();
            }
        });
    });
}

function dealDetail(detail) {
    return JSON.stringify(detail);
}

function num(req, res, next) {
    UserDao.checkLogin(req, res, next, (user) => {
        $dao.doQuery(sqls.NUM, [user.user_id], (err, result) => {
            if (result && result[0]) {
                $cresp.resp($CONST.CART_NUM, req, res, err, result);
            } else {
                next();
            }
        });
    });
}

function products(req, res, next) {
    UserDao.checkLogin(req, res, next, (user) => {
        $dao.doQuery(sqls.CART, [user.user_id], (err, result) => {
            if (result && result[0]) {
                $dao.doQuery(sqls.CART_QUERY_ADDRESS_DEFAULT, [user.user_id], (_err, _result) => {
                    for (let i = 0; i < result.length; i++) {
                        let o = [];
                        let others = '';
                        try {
                            o = JSON.parse(result[i].others);
                        } catch (error) {
                            $cresp.resp(null, req, res, err, []);
                            return;
                        }
                        for (let j = 0; j < o.length; j++) {
                            others += o[j]['value'];
                            others += j == o.length - 1 ? '' : " | "
                        }
                        result[i].others = others;
                    }
                    if(_result[0]){
                        let obj = _result[0].address;
                        try {
                            obj = JSON.parse(obj);
                        } catch (error) {
                            $cresp.resp($CONST.CART_NO_ADDRESS, req, res, err, []);
                            return;
                        }
                        result[0].address = obj;
                        $cresp.resp($CONST.CART, req, res, err, result);
                    }else{
                        $cresp.resp($CONST.CART_NO_ADDRESS, req, res, err, []);
                    }
                });
            } else {
                $cresp.resp($CONST.CART, req, res, err, []);
            }
        });
    });
}

function cart(req, res, next) {
    UserDao.checkLogin(req, res, next, (user) => {
        $dao.doQuery(sqls.CART, [user.user_id], (err, result) => {
            if (result && result[0]) {
                for (let i = 0; i < result.length; i++) {
                    let o = result[i].others;
                    let others = '';
                    try {
                        o = JSON.parse(o);
                    } catch (error) {
                        $cresp.resp(null, req, res, err, []);
                        return;
                    }
                    for (let j = 0; j < o.length; j++) {
                        others += o[j]['value'];
                        others += j == o.length - 1 ? '' : " | "
                    }
                    result[i].others = others;
                }

                $cresp.resp($CONST.CART, req, res, err, result);
            } else {
                $cresp.resp($CONST.CART, req, res, err, []);
            }
        });
    });
}

function editNum(req, res, next) {
    UserDao.checkLogin(req, res, next, (user)=> {
        let {
            num,
            cid
        } = req.body;
        num = parseInt(decryptRsa(num));
        cid = decryptRsa(cid);
        $dao.doQuery(sqls.CART_UPDATE_NUM, [num,cid,user.user_id], (err, result) => {
            if (result) {
                $cresp.resp($CONST.CART_EDIT_NUM, req, res, err, result);
            } else {
                $cresp.resp("", req, res, err, undefined);
            }
        });
    });
}

function del(req, res, next) {
    UserDao.checkLogin(req, res, next, (user)=> {
        let {
            cid
        } = req.body;
        cid = decryptRsa(cid);
        $dao.doQuery(sqls.CART_DEL, [cid,user.user_id], (err, result) => {
            if (result) {
                $cresp.resp($CONST.CART_DEL, req, res, err, result);
            } else {
                $cresp.resp("", req, res, err, undefined);
            }
        });
    });
}