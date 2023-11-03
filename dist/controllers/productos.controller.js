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
exports.setProductos = exports.getProductos = void 0;
// DB
const database_1 = require("../database");
function getProductos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idcategoria, idempresa } = req.params;
            console.log('idcategoria');
            console.log(idcategoria);
            const select = "select a.id, a.producto, a.descripcion, b.categoria, c.impuesto, c.tasa, a.costo, a.precio, d.unidad  ";
            const from = "from t_productos a, t_categorias b, t_impuestos c, t_unidades d ";
            let where = " where a.idcategoria = b.id and b.idempresa = $1 and a.idimpuesto = c.id and a.idunidad = d.id";
            if (Number(idcategoria) > 0) {
                where += " and a.idcategoria = " + idcategoria;
            }
            const resp = yield database_1.pool.query(select + from + where, [idempresa]);
            console.log(resp.rows);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando producto ' + e);
        }
    });
}
exports.getProductos = getProductos;
function setProductos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { producto, descripcion, idcategoria, idimpuesto, idunidad, costo, precio } = req.body;
            const insert = "insert into t_productos (producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7)";
            yield database_1.pool.query(insert + values, [producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad]);
            const data = {
                success: true,
                resp: {
                    message: "Producto creado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando producto ' + e);
        }
    });
}
exports.setProductos = setProductos;
