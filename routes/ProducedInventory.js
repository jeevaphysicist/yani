const express = require('express');

const router = express.Router();

const { createProducedInventory ,GetProducedInventoryData, updateProducedInventory, deleteproduct } =require('../Controllers/ProducedInventory');

router.post('/create-produced-inventory',createProducedInventory);
router.get('/get-produced-data',GetProducedInventoryData);
router.post('/update-produced-data',updateProducedInventory);
router.delete('/delete-product/:id', deleteproduct);



module.exports = router ;