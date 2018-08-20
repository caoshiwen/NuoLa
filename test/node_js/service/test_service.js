var dao = require("./dao");
var sequelize = dao.sequelize,
    Sequelize = dao.Sequelize;

var test_service = () => {
    var USER = sequelize.define('user_key', {
        user_id: {
            type: Sequelize.STRING(64),
            primaryKey: true
        },
        user_name: Sequelize.STRING(32),
        user_phone: Sequelize.STRING(18),
        user_password: Sequelize.STRING(32),
        user_email: Sequelize.STRING(32)
    }, {
        timestamps: false
    });

    var now = Date.now();
    // 增
    USER.create({
        user_id: 'g-' + now,
        user_name: 'Gaffey',
        user_phone: '15557986337',
        user_email: '470136090@qq.com',
        user_password: 'Gaffey'

    }).then(function (p) {
        console.log('created.' + JSON.stringify(p));
        console.log(p)
    }).catch(function (err) {
        console.log('failed: ' + err);
    });
}

let create = ({})

exports.do = test_service;