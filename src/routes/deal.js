const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

router.get('/', dealController.getAllDeals);
router.post('/',dealController.createDeal);


module.exports = router;