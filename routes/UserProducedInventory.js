const express = require('express');

const router = express.Router();

const { createUserProducedInventory ,GetUserProducedInventoryData , UpdateUserProducedInventoryData} =require('../Controllers/UserProducedInventory');

router.post('/create-produced-inventory',createUserProducedInventory);
router.get('/get-produced-data/:id',GetUserProducedInventoryData);
router.post('/update-produced-inventory',UpdateUserProducedInventoryData);

module.exports = router ;