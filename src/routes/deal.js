const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

router.get('/', dealController.getAllDeals);
router.get('/:data', dealController.getAllDealsByDay);


module.exports = router;