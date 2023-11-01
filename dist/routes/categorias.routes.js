"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorias_controller_1 = require("../controllers/categorias.controller");
const router = (0, express_1.Router)();
router.route('/:idempresa')
    .get(categorias_controller_1.getCategorias);
router.route('/')
    .post(categorias_controller_1.setCategoria);
exports.default = router;
