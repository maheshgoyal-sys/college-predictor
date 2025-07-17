const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

const auth = require('../middlewares/authMiddleware');

router.get("/api", studentController.apiTest);
router.get('/register',function(req,res){
    res.render('register');
})
router.post("/register", studentController.registerStudent);
router.get('/login',function(req,res){
    res.render('login');
})
router.post("/login", studentController.loginStudent);
router.get("/:_id", auth(['student']),studentController.getStudentById);
router.put("/:_id", auth(['student']),studentController.updateStudent);
router.delete("/:_id", auth(['admin']),studentController.deleteStudent);

module.exports = router;

