const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.get('/', pedidoController.listar);
router.get('/:id', pedidoController.obtener);
router.post('/', pedidoController.crear);
router.put('/:id', pedidoController.actualizar);
router.delete('/:id', pedidoController.eliminar);

module.exports = router;