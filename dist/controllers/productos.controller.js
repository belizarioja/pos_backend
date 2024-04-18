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
exports.updateProductos = exports.setProducto = exports.getProductos = void 0;
// DB
const database_1 = require("../database");
function getProductos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idcategoria, idempresa } = req.params;
            const select = "select a.id, a.producto, a.descripcion, a.idcategoria, b.categoria, a.idimpuesto, c.impuesto, c.tasa, a.costo, a.precio, d.unidad, a.idunidad, a.inventario1, a.sku, a.costousd, a,preciousd, a.utilidad, a.intipoproducto ";
            const from = "from t_productos a, t_categorias b, t_impuestos c, t_unidades d ";
            let where = " where a.idcategoria = b.id and b.idempresa = $1 and a.idimpuesto = c.id and a.idunidad = d.id";
            if (Number(idcategoria) > 0) {
                where += " and a.idcategoria = " + idcategoria;
            }
            const resp = yield database_1.pool.query(select + from + where, [idempresa]);
            // console.log( resp.rows)
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
function setProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { producto, descripcion, idcategoria, idimpuesto, idunidad, costo, precio, inventario, sku, costousd, preciousd, utilidad, intipoproducto } = req.body;
            const insert = "insert into t_productos (producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad, inventario1, sku, costousd, preciousd, utilidad, intipoproducto) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
            yield database_1.pool.query(insert + values, [producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad, inventario, sku, costousd, preciousd, utilidad, intipoproducto]);
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
exports.setProducto = setProducto;
function updateProductos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { producto, descripcion, idcategoria, idimpuesto, idunidad, costo, precio, inventario, sku, id, costousd, preciousd, utilidad } = req.body;
            const sql = "update t_productos set producto = $1, descripcion = $2, idcategoria = $3, idimpuesto = $4, costo = $5, precio = $6, idunidad = $7, inventario1 = $8, sku = $9, costousd = $10, preciousd = $11, utilidad = $12 ";
            const where = " where id = $13";
            yield database_1.pool.query(sql + where, [producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad, inventario, sku, costousd, preciousd, utilidad, id]);
            const data = {
                success: true,
                resp: {
                    message: "Producto actualizado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando producto ' + e);
        }
    });
}
exports.updateProductos = updateProductos;
