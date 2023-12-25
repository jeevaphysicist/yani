const express = require('express');

const router = express.Router();

const { createBills ,GetBillingData, updateBillings} =require('../Controllers/Billing');

router.post('/create-bill', createBills);
router.get('/get-bill', GetBillingData);
router.post('/update-bill', updateBillings);


module.exports = router ;