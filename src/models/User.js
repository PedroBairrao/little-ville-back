const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  senha: {
    // Sempre armazenada como hash (bcrypt), nunca em texto puro.
    type: DataTypes.STRING,
    allowNull: false,
  },
  papel: {
    // 'morador' (padrao) ou 'administrador'
    type: DataTypes.ENUM('morador', 'administrador'),
    allowNull: false,
    defaultValue: 'morador',
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
});

module.exports = User;
