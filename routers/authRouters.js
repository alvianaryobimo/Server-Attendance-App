const router = require('express').Router();
const authControllers = require("../controllers/authControllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.post("/", verifyToken, authControllers.register);
router.post("/adminlogin", authControllers.adminLogin);
router.post("/employeelogin", authControllers.employeeLogin);
router.get("/keeplogin", verifyToken, authControllers.keepLogin);
router.patch("/updateprofile", verifyToken, multerUpload(`./public/imgProfile`, 'imgProfile').single('imgProfile'), authControllers.updateProfile);

module.exports = router;