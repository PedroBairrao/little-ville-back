require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Avistamento } = require('./models');

// Script opcional para popular o banco com dados de demonstracao.
// Rode com: npm run seed
async function seed() {
  await sequelize.sync({ force: true });

  const senhaHash = await bcrypt.hash('senha123', 10);

  const admin = await User.create({
    nome: 'Prefeita Anabela',
    email: 'admin@littleville.gov',
    senha: senhaHash,
    papel: 'administrador',
  });

  const morador1 = await User.create({
    nome: 'Tomás Herdeiro',
    email: 'tomas@littleville.com',
    senha: senhaHash,
  });

  const morador2 = await User.create({
    nome: 'Clarice Bento',
    email: 'clarice@littleville.com',
    senha: senhaHash,
  });

  const hoje = new Date();
  const diasAtras = (n) => new Date(hoje.getTime() - n * 24 * 60 * 60 * 1000);

  await Avistamento.bulkCreate([
    {
      criatura: 'Pé Grande',
      descricao: 'Pegadas enormes encontradas perto da trilha da represa, com quase 40cm de comprimento.',
      localizacao: 'Trilha da Represa Velha',
      dataHoraOcorrencia: diasAtras(1),
      nivelCredibilidade: 'alto',
      status: 'pendente',
      userId: morador1.id,
    },
    {
      criatura: 'Luzes no céu',
      descricao: 'Três luzes piscando em formação triangular sobre o milharal por cerca de dois minutos.',
      localizacao: 'Fazenda dos Alcatéia',
      dataHoraOcorrencia: diasAtras(2),
      nivelCredibilidade: 'medio',
      status: 'confirmado',
      userId: morador2.id,
    },
    {
      criatura: 'Criatura do Lago',
      descricao: 'Algo grande nadou sob o barco de pesca, deixando um rastro de bolhas incomum.',
      localizacao: 'Lago Sombrio',
      dataHoraOcorrencia: diasAtras(4),
      nivelCredibilidade: 'baixo',
      status: 'descartado',
      userId: morador1.id,
    },
    {
      criatura: 'Pé Grande',
      descricao: 'Uivo grave e prolongado ouvido de dentro de casa, seguido por galhos quebrando na floresta.',
      localizacao: 'Bairro Beira-Bosque',
      dataHoraOcorrencia: diasAtras(6),
      nivelCredibilidade: 'medio',
      status: 'pendente',
      userId: morador2.id,
    },
    {
      criatura: 'Sombra Alta',
      descricao: 'Vulto de mais de 2 metros observado atravessando o quintal durante a madrugada.',
      localizacao: 'Rua das Acácias, 12',
      dataHoraOcorrencia: diasAtras(9),
      nivelCredibilidade: 'alto',
      status: 'confirmado',
      userId: morador1.id,
    },
  ]);

  console.log('Banco populado com dados de demonstracao!');
  console.log('Login de exemplo -> email: tomas@littleville.com | senha: senha123');
  console.log('Login admin      -> email: admin@littleville.gov  | senha: senha123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao popular o banco:', err);
  process.exit(1);
});
