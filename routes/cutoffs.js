const express = require('express');
const router = express.Router();
const cutoffController = require('../controllers/cutoffController');

const auth = require('../middlewares/authMiddleware');


router.get('/api', cutoffController.apiTest);

router.post('/addCutoff', auth(['admin', 'superadmin']),cutoffController.createCutoff);
router.get('/cutoffs', cutoffController.getAllCutoffs);
router.get('/cutoffs/:id', cutoffController.getCutoffById);
router.put('/cutoffs/:id', auth(['admin', 'superadmin']),cutoffController.updateCutoff);
router.delete('/cutoffs/:id', auth(['admin', 'superadmin']),cutoffController.deleteCutoff);

module.exports = router;
