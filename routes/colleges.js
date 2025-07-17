const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');

const auth = require('../middlewares/authMiddleware');

// Routes

router.post('/create', auth(['admin', 'superadmin']),collegeController.createCollege);


router.get('/:_id', collegeController.readCollegeById);       // ← ID route first

router.post('/:name', collegeController.readCollegeByName); // ← Then name route

router.put('/:_id', auth(['admin', 'superadmin']),collegeController.updateCollege);

router.delete('/:_id', auth(['admin', 'superadmin']),collegeController.deleteCollege);

module.exports = router;
