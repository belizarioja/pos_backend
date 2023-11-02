"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controller_1 = require("../controllers/clientes.controller");
const router = (0, express_1.Router)();
router.route('/buscar')
    .post(clientes_controller_1.getClientes);
router.route('/crear')
    .post(clientes_controller_1.setCliente);
exports.default = router;
