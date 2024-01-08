const express = require('express');

const router = express.Router();

const { signup ,login, getallusers, UpdateUser} =require('../Controllers/User');

router.post('/signup',signup);
router.post('/login',login);
router.get('/getallusers/:query',getallusers);
router.post('/updateuser',UpdateUser);

module.exports = router ;