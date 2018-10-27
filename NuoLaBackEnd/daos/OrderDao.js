let $dao = require("./Dao"),
    $oresp = require("../service/resp/OrderResp"),
    $util = require("../util/Util"),
    $CONST = require("../util/CONST"),
    moment = require("moment"),
    UserDao = require("./UserDao"),
    {
        decryptRsa
    } = require("../util/Encryption");

const sqls = {
    ADD: `INSERT INTO orders(o_id,u_id,o_id_for_production_system,o_products,o_price,o_pay,o_address) 
    VALUES(?,?,?,?,?,?,(select user_address from user_keys where user_id = ?))`,
    CART: `SELECT cart.c_id cid,cart.u_id uid,cart.p_id pid,p.p_img_src img,p.p_name name,pt.pt_name type,pt.pt_type pt_type,cart.c_detail others,cart.c_num num,p.p_price price 
    FROM cart
    inner join products p on p.p_id = cart.p_id
    inner join product_types pt on pt.pt_name = p.p_type
    WHERE cart.u_id = ?
    `,
    LIST: `SELECT o_id id, o_id_for_production_system id_fps, date_format(o_time, '%Y-%m-%d %T') time, o_price price, o_address address, o_pay pay
    FROM ORDERS
    WHERE u_id = ?
    `,
    CLEAR_CART: `DELETE FROM CART WHERE u_id = ? `,
    COUNT: `SELECT COUNT(*) total
    FROM ORDERS
    WHERE u_id = ?`,
}
module.exports = {
    add,
    list
};

function add(req, res, next) {
    UserDao.checkLogin(req, res, next, (user) => {
        $dao.doQuery(sqls.CART, [user.user_id], (err, result) => {
            let price = calculateTotal(result);
            let {
                subtotal,
                ship,
                taxes
            } = price;
            price = JSON.stringify(price);
            let products = JSON.stringify(result);
            let pay = parseFloat(subtotal) + parseFloat(ship) + parseFloat(taxes);
            console.log(products, price, pay);
            $dao.doQuery(sqls.ADD, [$util.creatOrderId(), user.user_id, createdIdForProductionSystem(), products, price, pay.toFixed(2) - 0, user.user_id], (_err, _result) => {
                console.log(_result)
                if (_result && _result.affectedRows) {
                    $oresp.resp($CONST.ORDER_ADD, req, res, err, []);
                    clearCart(user);
                } else {
                    $oresp.resp($CONST.ORDER_ADD_FAULT, req, res, err, []);
                }
            });
        });
    });
}

function createdIdForProductionSystem() {
    return $util.getUUID();
}

function calculateTotal(result) {
    //num price
    let total = 0;
    for (const key in result) {
        if (result.hasOwnProperty(key)) {
            const element = result[key];
            total += element.num * element.price;
        }
    }
    let subtotal = total.toFixed(2);
    let ship = calculateShip(result, total);
    let taxes = calculateTaxes(result, total);
    return {
        subtotal,
        ship,
        taxes
    };
}

function calculateShip(result, total) {
    let ship = 0;
    ship = total * 0.1;
    return ship.toFixed(2);
}

function calculateTaxes(result, total) {
    let taxes = 0;
    taxes = total * 0.1;
    return taxes.toFixed(2);
}

function clearCart(user) {
    $dao.doQuery(sqls.CLEAR_CART, [user.user_id], (err, result) => {
        console.log(result.affectedRows);
    });
}

function list(req, res, next) {
    UserDao.checkLogin(req, res, next, (user) => {
        let {
            current,
            size,
        } = req.body;
        current = decryptRsa(current);
        size = decryptRsa(size);
        let limit = $util.getLimit(current, size);
        let filter = ' order by o_time desc, o_id_for_production_system desc ';
        console.log(sqls.LIST+filter+limit);
        $dao.doQuery(sqls.LIST + filter + limit, [user.user_id], (err, result) => {
            $dao.doQuery(sqls.COUNT, [user.user_id], (_err, _result) => {
                if (result&&_result&&_result[0].total) {
                    result[0].total = _result[0].total;
                    $oresp.resp($CONST.ORDER_LIST, req, res, err, result);
                } else {
                    $oresp.resp($CONST.ORDER_LIST, req, res, err, []);
                }
            });            
        });
    });
}