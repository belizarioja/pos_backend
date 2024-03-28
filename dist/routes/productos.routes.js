"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_controller_1 = require("../controllers/productos.controller");
const router = (0, express_1.Router)();
router.route('/:idempresa/:idcategoria').get(productos_controller_1.getProductos);
router.route('/').post(productos_controller_1.setProductos);
router.route('/updateproductos').post(productos_controller_1.updateProductos);
exports.default = router;
