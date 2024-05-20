const express = require('express');

const router = express.Router();

const { createUserProducedInventory ,GetUserProducedInventoryData , UpdateUserProducedInventoryData, GetAllDispatchForAdmin, DeleteDispatchForAdmin, GetDispatchAllDataHandler} =require('../Controllers/UserProducedInventory');


router.post('/create-produced-inventory',createUserProducedInventory);
router.get('/get-produced-data/:id',GetUserProducedInventoryData);
router.post('/update-produced-inventory',UpdateUserProducedInventoryData);
router.get('/get-all-dispatch-for-admin',GetAllDispatchForAdmin);
router.delete('/delete-dispatch-for-admin',DeleteDispatchForAdmin);
router.get('/get-all-dispatch-data',GetDispatchAllDataHandler);
module.exports = router ;