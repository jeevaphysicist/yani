const express = require('express');

const router = express.Router();

const { createClientInventory , GetClientInventoryData, updateClietnInventory, deleteClient } =require('../Controllers/ClientInventory');

router.post('/create-client-inventory',createClientInventory);
router.get('/get-client-data',GetClientInventoryData);
router.post('/update-client-data',updateClietnInventory);
router.delete('/delete-client/:id', deleteClient);


module.exports = router ;