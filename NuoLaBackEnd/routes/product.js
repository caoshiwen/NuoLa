var express = require('express');
var router = express.Router();
var ProductDao = require("../daos/ProductDao");

router.post("/types", (req, res, next) => {
  ProductDao.getTypes(req, res, next);
});
router.post("/list", (req, res, next) => {
  ProductDao.getList(req, res, next);
});
router.post("/detail", (req, res, next) => {
  ProductDao.getDetail(req, res, next);
});
module.exports = router;
