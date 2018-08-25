/**
 * merge two json objects into one
 * @param {JSONObject} des 
 * @param {JSONObject,Array} src 
 * @param {Boolean} overwrite 
 */
exports.mergeJsonObject  = (des, src, overwrite) => {
    let re = {};
    for (let key in des) {
        re[key] = des[key];
    }
    for (let key in src) {
        if(overwrite || !(key in re)) {
            re[key] = src[key];
        }
    }
}