"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configuracion_controller_1 = require("../controllers/configuracion.controller");
const router = (0, express_1.Router)();
router.route('/:id').get(configuracion_controller_1.getConfiguracion);
router.route('/getnumerointerno/:idempresa').get(configuracion_controller_1.getNumeroInterno);
router.route('/:id').put(configuracion_controller_1.updConfiguracion);
exports.default = router;
