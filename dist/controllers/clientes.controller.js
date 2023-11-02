"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCliente = exports.getClientes = void 0;
// DB
const database_1 = require("../database");
function getClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idtipodocumento, documento } = req.body;
            const select = "select * from t_clientes ";
            const where = " where idtipodocumento = $1 and documento = $2";
            const resp = yield database_1.pool.query(select + where, [idtipodocumento, documento]);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Buscando cliente ' + e);
        }
    });
}
exports.getClientes = getClientes;
function setCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idtipodocumento, documento, nombre, correo, telefono, direccion } = req.body;
            const insert = "insert into t_clientes (idtipodocumento, documento, nombre, correo, telefono, direccion) ";
            const values = " values ($1, $2, $3, $4, $5, $6) RETURNING id";
            const resp = yield database_1.pool.query(insert + values, [idtipodocumento, documento, nombre, correo, telefono, direccion]);
            const data = {
                success: true,
                resp: resp.rows[0].id
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando cliente ' + e);
        }
    });
}
exports.setCliente = setCliente;
