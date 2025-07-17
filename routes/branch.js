const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

const auth = require('../middlewares/authMiddleware');

router.get('/api', branchController.apiTest);
router.post('/create', auth(['admin', 'superadmin']),branchController.createBranch);
router.get('/read', branchController.getAllBranches);
router.get('/:_id', branchController.getBranchById);
router.put('/:_id', auth(['admin', 'superadmin']),branchController.updateBranch);
router.delete('/:_id', auth(['admin', 'superadmin']),branchController.deleteBranch);

module.exports = router;
