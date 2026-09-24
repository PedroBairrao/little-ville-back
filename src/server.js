require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const avistamentoRoutes = require('./routes/avistamentoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servico: 'Avistamentos de Little Ville' });
});

app.use('/api/auth', authRoutes);
app.use('/api/avistamentos', avistamentoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Tratamento simples para rotas nao encontradas.
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

const PORT = process.env.PORT || 3001;

async function iniciar() {
  try {
    await sequelize.authenticate();
    // Em producao real, prefira usar migrations. Para o escopo deste
    // projeto academico, sync() mantem as tabelas atualizadas com os models.
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`API de Little Ville rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Nao foi possivel conectar ao banco de dados:', err.message);
    process.exit(1);
  }
}

iniciar();
