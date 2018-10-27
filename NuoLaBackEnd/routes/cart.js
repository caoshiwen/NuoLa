var express = require('express');
var router = express.Router();
var CartDao = require("../daos/CartDao");

router.post("/add", (req, res, next) => {
  CartDao.add(req, res, next);
});
router.post("/num", (req, res, next) => {
  CartDao.num(req, res, next);
});
router.post("/unpaid", (req, res, next) => {
  CartDao.products(req, res, next);
});
router.post("/list", (req, res, next) => {
  CartDao.cart(req, res, next);
});
router.post("/editnum", (req, res, next) => {
  CartDao.editNum(req, res, next);
});
router.post("/del", (req, res, next) => {
  CartDao.del(req, res, next);
});
module.exports = router;
