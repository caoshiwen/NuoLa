var express = require('express');
var router = express.Router();
var OrderDao = require("../daos/OrderDao");

router.post("/add", (req, res, next) => {
  OrderDao.add(req, res, next);
});
router.post("/list", (req, res, next) => {
  OrderDao.list(req, res, next);
});
module.exports = router;
