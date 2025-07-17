const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');


const auth = require('../middlewares/authMiddleware');

router.get('/api', predictionController.apiTest);

// Student Access
router.post('/addprediction', auth(['student']),predictionController.createPrediction);
router.get('/predict/:studentId', auth(['student']),predictionController.getPredictionsByStudentId);
router.post('/predictedColleges',predictionController.predictedColleges)
router.get('/predictedColleges',function(req,res){
    res.render('predictedColleges')
})

// Admin Access
router.delete('/predict/:id', auth(['admin','superadmin']),predictionController.deletePrediction);

module.exports = router;
