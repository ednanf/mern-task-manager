const express = require('express');
const { xss } = require('express-xss-sanitizer');

const { register, login } = require('../controllers/auth');

const router = express.Router();

router.post('/register', xss(), register);
router.post('/login', xss(), login);

module.exports = router;
