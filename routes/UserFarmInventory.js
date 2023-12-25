const express = require('express');

const router = express.Router();

const { createUserFarmInventory ,GetUserFarmInventoryData ,UpdateUserFarmINventory} =require('../Controllers/UserFarmInventory');

router.post('/create-farm-inventory',createUserFarmInventory);
router.get('/get-farm-data/:id',GetUserFarmInventoryData);
router.post('/update-farm-inventory',UpdateUserFarmINventory);

module.exports = router ;