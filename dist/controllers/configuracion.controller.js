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
exports.updConfiguracion = exports.getNumeroInterno = exports.getConfiguracion = void 0;
// DB
const database_1 = require("../database");
function getConfiguracion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const sql = "select id, tasabcv, urlfacturacion, tokenfacturacion, empresa, rif, direccion, telefono, email, tipomoneda, mostrartotal ";
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
function getNumeroInterno(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idempresa } = req.params;
            const sql = "select max (numerointerno) as numerointerno ";
            const from = " from t_ventas ";
            const where = " where idempresa = $1 ";
            const resp = yield database_1.pool.query(sql + from + where, [idempresa]);
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
exports.getNumeroInterno = getNumeroInterno;
function updConfiguracion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { tasabcv, tipomoneda, mostrartotal, actualizar } = req.body;
            if (tasabcv > 0 && actualizar === 1) {
                console.log('Actualizando Inventario... ');
                const sql = "update t_productos set costo = costousd * $2, precio = preciousd * $2 ";
                const where = " where idcategoria in (select id from t_categorias where idempresa = $1 )";
                yield database_1.pool.query(sql + where, [id, tasabcv]);
            }
            if (tasabcv > 0) {
                console.log('Actualizando Tasa BCV... ');
                const upd2 = "update t_empresas set tasabcv = $1 where id = $2 ";
                yield database_1.pool.query(upd2, [tasabcv, id]);
            }
            if (tipomoneda && mostrartotal) {
                console.log('Actualizando tipomoneda y mostrartotal... ');
                let upd = "update t_empresas set tipomoneda = $1, mostrartotal = $2 where id = $3 ";
                yield database_1.pool.query(upd, [tipomoneda, mostrartotal, id]);
            }
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
