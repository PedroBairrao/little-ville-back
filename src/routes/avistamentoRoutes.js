const express = require('express');
const {
  criar, listar, obterPorId, atualizar, remover,
} = require('../controllers/avistamentoController');
const autenticar = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de avistamentos exigem morador autenticado.
router.use(autenticar);

router.post('/', criar);
router.get('/', listar);
router.get('/:id', obterPorId);
router.put('/:id', atualizar);
router.delete('/:id', remover);

module.exports = router;
