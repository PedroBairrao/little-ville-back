const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/registrar
async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha sao obrigatorios.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: 'Ja existe um morador cadastrado com este email.' });
    }

    // Nunca armazenar a senha em texto puro: gera o hash com bcrypt.
    const hash = await bcrypt.hash(senha, 10);

    const usuario = await User.create({ nome, email, senha: hash });
    const token = gerarToken(usuario);

    return res.status(201).json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
      token,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao registrar morador.', detalhe: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha sao obrigatorios.' });
    }

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const token = gerarToken(usuario);

    return res.json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
      token,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao fazer login.', detalhe: err.message });
  }
}

// GET /api/auth/me
async function me(req, res) {
  const usuario = await User.findByPk(req.usuario.id, {
    attributes: ['id', 'nome', 'email', 'papel', 'createdAt'],
  });
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuario nao encontrado.' });
  }
  return res.json({ usuario });
}

module.exports = { registrar, login, me };
