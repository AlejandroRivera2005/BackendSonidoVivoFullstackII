const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/perfil', autenticar, authController.perfil);

module.exports = router;