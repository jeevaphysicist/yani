const express = require('express');

const router = express.Router();

const { createFarmInventory ,GetFarmInventoryData} =require('../Controllers/FarmInventory');

router.post('/create-farm-inventory',createFarmInventory);
router.get('/get-farm-data',GetFarmInventoryData);

module.exports = router ;