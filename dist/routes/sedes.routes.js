"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sedes_controller_1 = require("../controllers/sedes.controller");
const router = (0, express_1.Router)();
router.route('/estatus/:id').put(sedes_controller_1.updateEstatusSede);
router.route('/').get(sedes_controller_1.getEmpresas);
exports.default = router;
