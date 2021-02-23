const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

router.get('/', dealController.getAllDeals);
router.post('/',dealController.createDeal);
router.delete('/:id',dealController.deleteOne);

module.exports = router;