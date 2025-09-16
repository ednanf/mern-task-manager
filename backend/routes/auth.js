const express = require('express');
const { xss } = require('../middleware/sanitizer');

const { register, login, check, logout } = require('../controllers/auth');

const router = express.Router();

router.post('/register', xss(), register);
router.post('/login', xss(), login);
router.get('/check', xss(), check);
router.get('/logout', xss(), logout);

module.exports = router;
