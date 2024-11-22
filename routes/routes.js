var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var userController = require("../controllers/UserControlle");
var adminAuth = require("../middleware/AdminAuth");

router.get('/', HomeController.index);
router.post('/login', userController.login);
router.post('/user' , adminAuth , userController.create);
router.get('/user', adminAuth, userController.index);
router.get('/user/:id', adminAuth, userController.findUser);
router.put('/user', adminAuth, userController.edit);
router.delete('/user/:id', adminAuth, userController.remove)
router.post('/recoverpassword', adminAuth, userController.recoverPassword);
router.post('/changedpassword', adminAuth, userController.changedPassword);
router.post('/validate', adminAuth, HomeController.validade)

module.exports = router;