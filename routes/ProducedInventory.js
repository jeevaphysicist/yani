const express = require('express');

const router = express.Router();

const { createProducedInventory ,GetProducedInventoryData, updateProducedInventory } =require('../Controllers/ProducedInventory');

router.post('/create-produced-inventory',createProducedInventory);
router.get('/get-produced-data',GetProducedInventoryData);
router.post('/update-produced-data',updateProducedInventory);



module.exports = router ;