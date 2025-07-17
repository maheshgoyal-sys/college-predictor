const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const auth = require('../middlewares/authMiddleware');

router.get("/api", adminController.apiTest);
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/me", auth(['admin', 'superadmin']),adminController.getProfile);
router.get("/all", auth(['superadmin']),adminController.getAllAdmins);
router.delete("/delete/:username", auth(['superadmin']),adminController.deleteAdmin);



module.exports = router;
