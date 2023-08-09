const adminControllers = require("../controllers/adminControllers");
const { verifyToken, checkRole } = require("../middleware/auth");
const router = require('express').Router();

router.get("/", adminControllers.getAllEmployees);
router.post("/sendemail", adminControllers.sendEmail);
router.get("/employeesrole", adminControllers.employeesRole);

module.exports = router;