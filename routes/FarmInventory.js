const express = require('express');

const router = express.Router();

const { createFarmInventory ,GetFarmInventoryData, updateFarmInventory, deleteproduct} =require('../Controllers/FarmInventory');

router.post('/create-farm-inventory',createFarmInventory);
router.get('/get-farm-data',GetFarmInventoryData);
router.post('/update-farm-data',updateFarmInventory);
router.delete('/delete-product/:id', deleteproduct);
 
module.exports = router ;