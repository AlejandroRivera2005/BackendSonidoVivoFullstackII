const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');
const { autenticar, soloAdmin } = require('../middlewares/auth.middleware');

router.use(autenticar);
router.get('/mios', pedidoController.mios);
router.post('/', pedidoController.crear);
router.get('/', soloAdmin, pedidoController.listar);
router.get('/:id', pedidoController.obtener);
router.put('/:id', soloAdmin, pedidoController.actualizar);
router.delete('/:id', soloAdmin, pedidoController.eliminar);

module.exports = router;

