const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Avistamento = sequelize.define('Avistamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  criatura: {
    // Ex: "Pe Grande", "Luzes no ceu", "Criatura no lago" etc.
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  localizacao: {
    // Descricao textual do local (ex: "Floresta ao norte da represa")
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  dataHoraOcorrencia: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nivelCredibilidade: {
    type: DataTypes.ENUM('baixo', 'medio', 'alto'),
    allowNull: false,
    defaultValue: 'medio',
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'descartado'),
    allowNull: false,
    defaultValue: 'pendente',
  },
  imagemUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'avistamentos',
  timestamps: true,
});

module.exports = Avistamento;
