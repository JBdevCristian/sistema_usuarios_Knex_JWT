var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var userController = require("../controllers/UserControlle");

router.get('/', HomeController.index);
router.post('/user', userController.create);
router.get('/user', userController.index);
router.get('/user/:id', userController.findUser);

module.exports = router;