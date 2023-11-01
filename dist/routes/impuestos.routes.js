"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const impuestos_controller_1 = require("../controllers/impuestos.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(impuestos_controller_1.getImpuestos);
exports.default = router;
