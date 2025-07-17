const express = require("express");
const router = express.Router();
const counsellingController = require("../controllers/counsellingController");

const auth = require('../middlewares/authMiddleware');

router.get("/api", counsellingController.apiTest);
router.post("/create", auth(['admin', 'superadmin']),counsellingController.createCounselling);
router.get("/read", counsellingController.readAllCounselling);
router.get("/:_id", counsellingController.readCounsellingById);
router.put("/:_id", auth(['admin', 'superadmin']),counsellingController.updateCounselling);
router.delete("/:_id", auth(['admin', 'superadmin']),counsellingController.deleteCounselling);

module.exports = router;