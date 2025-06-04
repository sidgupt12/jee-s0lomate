const express = require('express');
const {login,register} = require("../controllers/userController")

const router = express.Router();

// Register User
router.post('/register',register );

// Login User
router.post('/login', login );

module.exports = router;