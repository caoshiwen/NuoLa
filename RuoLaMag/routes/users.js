var express = require('express');
var router = express.Router();
var $dao = require('../service/daos/UserDao');


router.get('/rsa', function(req, res, next) {
  console.log("get /rsa");
  $dao.rsa(req, res, next);
});
/* post users listing. */
router.post('/login', function(req, res, next) {
  $dao.login(req, res, next);
});
router.post('/list', function(req, res, next) {
  console.log("post /list");
  try {
    $dao.list(req, res, next);
  } catch (error) {
    console.log(error);
    next();
  }
});
router.post("/banuser", function(req, res, next) {
  $dao.banUser(req, res, next);
});
//PERMISSIONS
router.post("/permissions", function(req, res, next) {
  $dao.permissions(req, res, next);
});
router.post("/addpermission", function(req, res, next) {
  $dao.addPermission(req, res, next);
});
router.post("/deletepermission", function(req, res, next) {
  $dao.deletePermission(req, res, next);
});
//OPERATIONS
router.post("/operations", function(req, res, next) {
  $dao.operations(req, res, next);
});
router.post("/addoperation", function(req, res, next) {
  $dao.addOperation(req, res, next);
});
router.post("/deleteoperation", function(req, res, next) {
  $dao.deleteOperation(req, res, next);
});
//USERPOWERS
router.post("/userpowers", function(req, res, next) {
  $dao.userpowers(req, res, next);
});
router.post("/adduserpower", function(req, res, next) {
  $dao.addUserpower(req, res, next);
});
router.post("/deleteuserpower", function(req, res, next) {
  $dao.deleteUserpower(req, res, next);
});
router.post("/allusers", function(req, res, next) {
  $dao.allUsers(req, res, next);
});
router.post("/allpermissions", function(req, res, next) {
  $dao.allPermissions(req, res, next);
})
module.exports = router;
