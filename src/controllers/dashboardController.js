const { Op, fn, col, literal } = require('sequelize');
const { Avistamento, User } = require('../models');

// GET /api/dashboard
// Reune as informacoes usadas no painel visual do frontend.
async function estatisticas(req, res) {
  try {
    const total = await Avistamento.count();

    const totalMoradores = await User.count();

    const porStatus = await Avistamento.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'quantidade']],
      group: ['status'],
    });

    const porCriatura = await Avistamento.findAll({
      attributes: ['criatura', [fn('COUNT', col('id')), 'quantidade']],
      group: ['criatura'],
      order: [[literal('quantidade'), 'DESC']],
      limit: 8,
    });

    // Avistamentos registrados nos ultimos 14 dias, agrupados por dia.
    const catorzeDiasAtras = new Date();
    catorzeDiasAtras.setDate(catorzeDiasAtras.getDate() - 13);
    catorzeDiasAtras.setHours(0, 0, 0, 0);

    const recentesParaLinha = await Avistamento.findAll({
      attributes: ['dataHoraOcorrencia'],
      where: { dataHoraOcorrencia: { [Op.gte]: catorzeDiasAtras } },
    });

    const linhaPorDia = {};
    for (let i = 0; i < 14; i += 1) {
      const dia = new Date(catorzeDiasAtras);
      dia.setDate(dia.getDate() + i);
      const chave = dia.toISOString().slice(0, 10);
      linhaPorDia[chave] = 0;
    }
    recentesParaLinha.forEach((item) => {
      const chave = new Date(item.dataHoraOcorrencia).toISOString().slice(0, 10);
      if (linhaPorDia[chave] !== undefined) linhaPorDia[chave] += 1;
    });
    const timeline = Object.entries(linhaPorDia).map(([data, quantidade]) => ({ data, quantidade }));

    const recentes = await Avistamento.findAll({
      include: [{ model: User, as: 'autor', attributes: ['id', 'nome'] }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return res.json({
      total,
      totalMoradores,
      porStatus,
      porCriatura,
      timeline,
      recentes,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao carregar estatisticas do dashboard.', detalhe: err.message });
  }
}

module.exports = { estatisticas };
