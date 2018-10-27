let $dao = require("./Dao"),
    $presp = require("../service/resp/ProductResp"),
    $util = require("../util/Util"),
    $CONST = require("../util/CONST"),
    moment = require("moment"),
    UserDao = require("./UserDao"),

    {
        decryptRsa
    } = require("../util/Encryption");

const sqls = {
    GET_TYPE: `SELECT pt_name name, pt_type type, pt_img img FROM product_types`,
    GET_LIST: `SELECT p.p_id id, p.p_price price, p.p_type type, p.p_name name,
    p.p_img_src img_src, DATE_FORMAT(p.p_create_time,'%Y-%m-%d %H:%i:%S') time,
    pt.pt_type pt_type, pt.pt_name_cn type_cn, pt.pt_type_cn pt_type_cn ,
    u.user_name creator
    from products p 
    inner join product_types pt on p.p_type = pt.pt_name
    inner join user_keys u on p.p_u_id = u.user_id
    `,
    GET_LIST_COUNT: `SELECT COUNT(*) total
    from products p 
    inner join product_types pt on p.p_type = pt.pt_name
    inner join user_keys u on p.p_u_id = u.user_id `,
    GET_DETAIL: `SELECT p.p_id id, p.p_name name, p.p_price price, p.p_type type,
    pt.pt_type pt_type,pt.pt_id pt_id,
    u.user_id creator_id, u.user_name creator
    from products p
    inner join product_types pt on p.p_type = pt.pt_name
    inner join user_keys u on p.p_u_id = u.user_id
    where p.p_id = ? `,
    GET_IMGS: `SELECT pi_url from product_imgs where p_id = ? `,
    GET_PROPERTIES: `SELECT pop_name name, pop_value value, pop_id id 
    from product_other_properties where pt_id = ? `,
}
module.exports = {
    getTypes,
    getList,
    getDetail
};

function getTypes(req, res, next) {
    // UserDao.checkLogin(req,res,next,id,key,(user)=>{
    // });

    $dao.doQuery(sqls.GET_TYPE, [], (err, result) => {
        if (result && result.length >= 0) {
            $presp.resp($CONST.PRODUCT_TYPES, req, res, err, result);
        } else {
            $presp.resp($CONST.PRODUCT_TYPES_ERROR, req, res, null, []);
        }
    });
}

function getList(req, res, next) {
    let {
        type,
        pt_type,
        current,
        size,
        like
    } = req.body;
    type = type?decryptRsa(type):"";
    pt_type = decryptRsa(pt_type);
    current = decryptRsa(current);
    size = decryptRsa(size);
    like = like ? decryptRsa(like) : "";
    let limit = $util.getLimit(current, size);
    let params = [];
    let where_type = type ? 'where p_type = ? ':' where pt_type = ? ';
    params.push(type?type:pt_type);
    let where = like ? ` and p.p_name like '%${like}%' ` : "";
    let filter = where_type + where + 'order by p.p_create_time desc, p.p_id ';
    console.log(sqls.GET_LIST + filter)
    console.log(type)
    $dao.doQuery(sqls.GET_LIST + filter + limit, params, (err, result) => {
        $dao.doQuery(sqls.GET_LIST_COUNT + filter, params, (_err, _result) => {
            if (result[0]&&_result[0]) {
                result[0].total = _result[0].total;
            }
            $presp.resp($CONST.PRODUCT_LIST, req, res, err, result);
        });
    });
}

function getDetail(req, res, next) {
    let {
        id
    } = req.body;
    id = decryptRsa(id);
    $dao.doQuery(sqls.GET_DETAIL, [id], (err, result) => {
        if(result&&result[0]&&result[0].id) {
            $dao.doQuery(sqls.GET_IMGS, [id], (_err, _result) => {
                if (_result[0]) {
                    result[0]['imgs'] = dealImgs(_result)
                }
                $dao.doQuery(sqls.GET_PROPERTIES, [result[0].pt_id], (__err, __result) => {
                    console.log(__result)
                    if(__result[0]) {
                        result[0]['properties'] = dealProperties(__result);
                    }
                    $presp.resp($CONST.PRODUCT_DETAIL, req, res, err, result);
                })
            });
        } else {
            $presp.resp($CONST.PRODUCT_DETAIL, req, res, err, []);
        }
    });
}
function dealImgs(arr) {
    let r = [];
    for(let i=0; i<arr.length; i++) {
        r.push(arr[i]['pi_url'])
    }
    return r;
}
function dealProperties(arr) {
    let r = [];

    for(let i=0; i<arr.length; i++) {
        r.push({name:arr[i]['name'], value:arr[i][`value`], id:arr[i]['id']})
    }
    return r;
}