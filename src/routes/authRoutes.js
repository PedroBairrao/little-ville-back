const express = require('express');
const { registrar, login, me } = require('../controllers/authController');
const autenticar = require('../middleware/auth');

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.get('/me', autenticar, me);

module.exports = router;
