const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;