const express = require('express');

const router = express.Router();

const { createClientInventory , GetClientInventoryData } =require('../Controllers/ClientInventory');

router.post('/create-client-inventory',createClientInventory);
router.get('/get-client-data',GetClientInventoryData);


module.exports = router ;