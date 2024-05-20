const express = require('express');

const router = express.Router();

const { signup ,login, getallusers, UpdateUser, deleteUser} =require('../Controllers/User');

router.post('/signup',signup);
router.post('/login',login);
router.get('/getallusers/:query',getallusers);
router.post('/updateuser',UpdateUser);
router.delete('/delete-user/:id',deleteUser);
 
module.exports = router ;