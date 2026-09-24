const sequelize = require('../config/database');
const User = require('./User');
const Avistamento = require('./Avistamento');

// Um usuario (morador) pode registrar varios avistamentos.
User.hasMany(Avistamento, { foreignKey: 'userId', as: 'avistamentos', onDelete: 'CASCADE' });
Avistamento.belongsTo(User, { foreignKey: 'userId', as: 'autor' });

module.exports = {
  sequelize,
  User,
  Avistamento,
};
