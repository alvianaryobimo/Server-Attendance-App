const attendanceControllers = require("../controllers/attendanceControllers");
const { verifyToken } = require("../middleware/auth");
const router = require('express').Router();

router.post("/clockin", verifyToken, attendanceControllers.clockIn);
router.post("/clockout", verifyToken, attendanceControllers.clockOut);
router.get("/log", verifyToken, attendanceControllers.employeeLog);
router.get("/report", verifyToken, attendanceControllers.employeeAttendance);
router.get("/cutsalary", verifyToken, attendanceControllers.calculateSalary);

module.exports = router;