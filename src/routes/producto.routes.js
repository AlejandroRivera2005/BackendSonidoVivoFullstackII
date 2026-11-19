const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { autenticar } = require('../middlewares/auth.middleware');



router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);
router.post('/', autenticar, productoController.crear);
router.put('/:id', autenticar, productoController.actualizar);
router.delete('/:id', autenticar, productoController.eliminar);

module.exports = router;