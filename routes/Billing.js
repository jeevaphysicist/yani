const express = require('express');

const router = express.Router();
const { GetDashBoardData } = require('../Controllers/Dashboard');

const { createBills ,GetBillingData, updateBillings, updateBilling, deleteBillings} =require('../Controllers/Billing');

router.post('/create-bill', createBills);
router.get('/get-bill/:query', GetBillingData);
router.post('/update-bills', updateBillings);
router.post('/update-bill', updateBilling);
router.delete('/delete-bill/:id', deleteBillings);
router.post('/dashboard-data', GetDashBoardData);


module.exports = router ;