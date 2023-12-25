const express = require('express');

const router = express.Router();

const { createProducedInventory ,GetProducedInventoryData } =require('../Controllers/ProducedInventory');

router.post('/create-produced-inventory',createProducedInventory);
router.get('/get-produced-data',GetProducedInventoryData);


module.exports = router ;