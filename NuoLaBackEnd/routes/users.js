var express = require('express');
var router = express.Router();
var UserDao = require("../daos/UserDao");
var Util = require("../util/Util");

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
/* GET user register*/
router.post("/register", (req, res, next) => {
  UserDao.add(req, res, next);
});
/* GET user querybyid*/
router.get("/querybyid",(req, res, next) => {
  UserDao.queryById(req, res, next);
});
/* GET user login*/
router.post("/login",(req, res, next) => {
  UserDao.login(req, res, next);
});
/* GET user logout*/
router.get("/logout",(req, res, next) => {
  UserDao.logout(req, res, next);
});
/* GET MAIL CODE*/
router.post("/mailcode",(req, res, next) => {
  UserDao.getActivateMailCode(req, res, next);
});
/* CHECK MAIL CODE*/
router.get("/checkmail",(req, res, next) => {
  UserDao.checkMailForUpdate(req, res, next);
});

/* UPDATE*/
router.post("/update",(req, res, next) => {
  UserDao.updateUser(req, res, next);
});

module.exports = router;
