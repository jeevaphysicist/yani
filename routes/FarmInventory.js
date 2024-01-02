const express = require('express');

const router = express.Router();

const { createFarmInventory ,GetFarmInventoryData, updateFarmInventory} =require('../Controllers/FarmInventory');

router.post('/create-farm-inventory',createFarmInventory);
router.get('/get-farm-data',GetFarmInventoryData);
router.post('/update-farm-data',updateFarmInventory);

module.exports = router ;