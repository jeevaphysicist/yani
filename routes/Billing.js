const express = require('express');

const router = express.Router();
const { GetDashBoardData ,GetProductQuantities,getmissingproductquantities, GetMissingQuantityForDispatch} = require('../Controllers/Dashboard');

const { createBills ,GetBillingData, updateBillings, BillingCheckAmount, updateBilling ,deleteBillings} =require('../Controllers/Billing');

router.post('/create-bill', createBills);
router.get('/get-bill/:query', GetBillingData);
router.post('/update-bills', updateBillings);
router.post('/update-bill', updateBilling);
router.delete('/delete-bill/:id', deleteBillings);
router.post('/dashboard-data', GetDashBoardData);
router.post('/waste-product', GetProductQuantities);
router.get('/get-missing-product-quantities', getmissingproductquantities);
router.get('/get-CheckAmount', BillingCheckAmount);
router.post('/missingQuantitydispatch',GetMissingQuantityForDispatch)


module.exports = router ;