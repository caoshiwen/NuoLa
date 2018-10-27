let mysql = require("mysql"),
    $conf = require("../conf/DB");
var pool = mysql.createPool($conf.mysql)
module.exports = {
    doQuery,
}


/**
 * do query
 * @param {String} sql
 * @param {Array} params
 * @param {Function} callback(@param err, @param result)
 */
function doQuery(sql, params, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            // connection err
            console.log(err);
        }
        connection.query(sql, params, function(err, result) {
            callback(err, result);
            connection.release();
        });
    });
}