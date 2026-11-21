const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { autenticar, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);
router.post('/', autenticar, soloAdmin, productoController.crear);
router.put('/:id', autenticar, soloAdmin, productoController.actualizar);
router.delete('/:id', autenticar, soloAdmin, productoController.eliminar);

module.exports = router;