"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidades_controller_1 = require("../controllers/unidades.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(unidades_controller_1.getUnidades);
exports.default = router;
