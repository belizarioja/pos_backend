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
exports.updConfiguracion = exports.getConfiguracion = void 0;
// DB
const database_1 = require("../database");
function getConfiguracion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const sql = "select id, tasabcv, urlfacturacion, tokenfacturacion, empresa, rif, direccion, telefono, email ";
            const from = " from t_empresas ";
            const where = " where id = $1 ";
            const resp = yield database_1.pool.query(sql + from + where, [id]);
            const data = {
                success: true,
                resp: resp.rows[0]
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Consultando Configuración >>>> ' + e);
        }
    });
}
exports.getConfiguracion = getConfiguracion;
function updConfiguracion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { tasabcv } = req.body;
            let upd = "update t_empresas set tasabcv = $1 ";
            const where = " where id = $2 ";
            const resp = yield database_1.pool.query(upd + where, [tasabcv, id]);
            const data = {
                success: true,
                resp: 'Configuración actualizada con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Editando Configuración >>>> ' + e);
        }
    });
}
exports.updConfiguracion = updConfiguracion;
