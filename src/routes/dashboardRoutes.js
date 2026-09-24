const express = require('express');
const { estatisticas } = require('../controllers/dashboardController');
const autenticar = require('../middleware/auth');

const router = express.Router();

router.get('/', autenticar, estatisticas);

module.exports = router;
