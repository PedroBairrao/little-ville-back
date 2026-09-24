const { Op } = require('sequelize');
const { Avistamento, User } = require('../models');

// POST /api/avistamentos
async function criar(req, res) {
  try {
    const { criatura, descricao, localizacao, dataHoraOcorrencia, nivelCredibilidade, imagemUrl } = req.body;

    if (!criatura || !descricao || !localizacao || !dataHoraOcorrencia) {
      return res.status(400).json({ erro: 'criatura, descricao, localizacao e dataHoraOcorrencia sao obrigatorios.' });
    }

    const avistamento = await Avistamento.create({
      criatura,
      descricao,
      localizacao,
      dataHoraOcorrencia,
      nivelCredibilidade,
      imagemUrl,
      userId: req.usuario.id,
    });

    return res.status(201).json({ avistamento });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao registrar avistamento.', detalhe: err.message });
  }
}

// GET /api/avistamentos?criatura=&status=&busca=&pagina=&limite=
async function listar(req, res) {
  try {
    const { criatura, status, busca } = req.query;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const limite = parseInt(req.query.limite, 10) || 12;

    const where = {};
    if (criatura) where.criatura = { [Op.like]: `%${criatura}%` };
    if (status) where.status = status;
    if (busca) {
      where[Op.or] = [
        { descricao: { [Op.like]: `%${busca}%` } },
        { localizacao: { [Op.like]: `%${busca}%` } },
        { criatura: { [Op.like]: `%${busca}%` } },
      ];
    }

    const { rows, count } = await Avistamento.findAndCountAll({
      where,
      include: [{ model: User, as: 'autor', attributes: ['id', 'nome'] }],
      order: [['dataHoraOcorrencia', 'DESC']],
      limit: limite,
      offset: (pagina - 1) * limite,
    });

    return res.json({
      avistamentos: rows,
      total: count,
      pagina,
      totalPaginas: Math.ceil(count / limite),
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar avistamentos.', detalhe: err.message });
  }
}

// GET /api/avistamentos/:id
async function obterPorId(req, res) {
  try {
    const avistamento = await Avistamento.findByPk(req.params.id, {
      include: [{ model: User, as: 'autor', attributes: ['id', 'nome'] }],
    });
    if (!avistamento) {
      return res.status(404).json({ erro: 'Avistamento nao encontrado.' });
    }
    return res.json({ avistamento });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar avistamento.', detalhe: err.message });
  }
}

function podeEditar(avistamento, usuario) {
  return avistamento.userId === usuario.id || usuario.papel === 'administrador';
}

// PUT /api/avistamentos/:id
async function atualizar(req, res) {
  try {
    const avistamento = await Avistamento.findByPk(req.params.id);
    if (!avistamento) {
      return res.status(404).json({ erro: 'Avistamento nao encontrado.' });
    }
    if (!podeEditar(avistamento, req.usuario)) {
      return res.status(403).json({ erro: 'Voce so pode editar avistamentos que voce mesmo registrou.' });
    }

    const campos = ['criatura', 'descricao', 'localizacao', 'dataHoraOcorrencia', 'nivelCredibilidade', 'status', 'imagemUrl'];
    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) avistamento[campo] = req.body[campo];
    });

    await avistamento.save();
    return res.json({ avistamento });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar avistamento.', detalhe: err.message });
  }
}

// DELETE /api/avistamentos/:id
async function remover(req, res) {
  try {
    const avistamento = await Avistamento.findByPk(req.params.id);
    if (!avistamento) {
      return res.status(404).json({ erro: 'Avistamento nao encontrado.' });
    }
    if (!podeEditar(avistamento, req.usuario)) {
      return res.status(403).json({ erro: 'Voce so pode excluir avistamentos que voce mesmo registrou.' });
    }

    await avistamento.destroy();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao excluir avistamento.', detalhe: err.message });
  }
}

module.exports = { criar, listar, obterPorId, atualizar, remover };
