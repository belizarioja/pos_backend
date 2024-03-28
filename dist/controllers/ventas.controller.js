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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVenta = exports.getItemsVentas = exports.getVentas = exports.setVenta = exports.deleteHolds = exports.deleteItemHolds = exports.getItemsHolds = exports.getHolds = exports.updItemHolds = exports.setItemHolds = exports.setHolds = void 0;
const moment_1 = __importDefault(require("moment"));
// DB
const database_1 = require("../database");
function setHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idcliente, idusuario, idtipofactura } = req.body;
            const fecha = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const insert = "insert into t_holds (idcliente, idusuario, fecha, idtipofactura) ";
            const values = " values ($1, $2, $3, $4) RETURNING id";
            let resp = yield database_1.pool.query(insert + values, [idcliente, idusuario, fecha, idtipofactura]);
            // console.log(resp.rows[0].id)
            const idhold = resp.rows[0].id;
            const data = {
                success: true,
                resp: {
                    idhold,
                    fecha
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error creandi holds ' + e);
        }
    });
}
exports.setHolds = setHolds;
function setItemHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento } = req.body;
            // console.log(idhold, idproducto, precio, cantidad, tasa, total, idunidad)
            const selectinventario = "select inventario1 from t_productos where id = $1 ";
            const respinventario = yield database_1.pool.query(selectinventario, [idproducto]);
            console.log('respinventario.rows[0].inventario1');
            console.log(respinventario.rows[0].inventario1);
            if (Number(respinventario.rows[0].inventario1) === 0) {
                return res.status(202).json({
                    success: false,
                    resp: 'Producto sin inventario'
                });
            }
            const sql = "update t_productos set inventario1 = inventario1 - $1 ";
            const whereupd = " where id = $2";
            yield database_1.pool.query(sql + whereupd, [cantidad, idproducto]);
            const insert = "insert into t_holds_items (idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
            let resp = yield database_1.pool.query(insert + values, [idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento]);
            // console.log(resp.rows[0].id)
            const iditemhold = resp.rows[0].id;
            const data = {
                success: true,
                resp: {
                    iditemhold
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error creando item holds ' + e);
        }
    });
}
exports.setItemHolds = setItemHolds;
function updItemHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { iditemhold, cantidad, total, idproducto, accion } = req.body;
            console.log(iditemhold, cantidad, total, idproducto);
            let sql = 'update t_productos set ';
            if (accion === 1) {
                const selectinventario = "select inventario1 from t_productos where id = $1 ";
                const respinventario = yield database_1.pool.query(selectinventario, [idproducto]);
                console.log('respinventario.rows[0].inventario1');
                console.log(Number(respinventario.rows[0].inventario1));
                if (Number(respinventario.rows[0].inventario1) === 0) {
                    console.log('Aqui 1');
                    return res.status(202).json({
                        success: true,
                        resp: 'Producto sin inventario'
                    });
                }
                else {
                    console.log('Aqui 2');
                    sql += " inventario1 = inventario1 - 1 ";
                }
            }
            else {
                console.log('Aqui 3');
                sql += " inventario1 = inventario1 + 1 ";
            }
            const whereupd = " where id = $1";
            yield database_1.pool.query(sql + whereupd, [idproducto]);
            const update = "update t_holds_items set cantidad = $1, total = $2 ";
            const where = " where id = $3 ";
            yield database_1.pool.query(update + where, [cantidad, total, iditemhold]);
            const data = {
                success: true,
                resp: 'Item holds actualizado con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error actualizando item holds ' + e);
        }
    });
}
exports.updItemHolds = updItemHolds;
function getHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idusuario } = req.params;
            const select = "select a.id as idhold, a.fecha, a.idcliente, b.nombre, b.documento, c.abrev  ";
            const from = "from t_holds a, t_clientes b, t_tipodocumentos c ";
            let where = " where a.idcliente = b.id and b.idtipodocumento = c.id and a.idusuario = $1";
            const resp = yield database_1.pool.query(select + from + where, [idusuario]);
            // console.log( resp.rows)
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando holds ' + e);
        }
    });
}
exports.getHolds = getHolds;
function getItemsHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idholds } = req.params;
            const select = "select a.id as iditemhold, a.idproducto, a.precio, a.cantidad, a.tasa, a.total, a.idunidad, b.producto, b.idcategoria, c.categoria ";
            const from = "from t_holds_items a, t_productos b, t_categorias c ";
            let where = " where a.idproducto = b.id and b.idcategoria = c.id and a.idhold = $1";
            const resp = yield database_1.pool.query(select + from + where, [idholds]);
            // console.log( resp.rows)
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando items holds ' + e);
        }
    });
}
exports.getItemsHolds = getItemsHolds;
function deleteItemHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { iditemhold, cantidad, idproducto } = req.body;
            // console.log(iditemhold, cantidad)
            const sqlupd = 'update t_productos set inventario1 = inventario1 + $1 ';
            const whereupd = " where id = $2";
            yield database_1.pool.query(sqlupd + whereupd, [cantidad, idproducto]);
            const sql = "delete from t_holds_items ";
            const where = " where id = $1 ";
            yield database_1.pool.query(sql + where, [iditemhold]);
            const data = {
                success: true,
                resp: 'Item holds ELIMINADO con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error ELIMINANDO item holds ' + e);
        }
    });
}
exports.deleteItemHolds = deleteItemHolds;
function deleteHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idhold } = req.params;
            const select = "select id, idproducto, cantidad ";
            const from = "from t_holds_items ";
            let where1 = " where idhold = $1";
            const resp = yield database_1.pool.query(select + from + where1, [idhold]);
            console.log(resp.rows);
            for (let i = 0; i < resp.rows.length; i++) {
                const idproducto = resp.rows[i].idproducto;
                const cantidad = resp.rows[i].cantidad;
                const sqlupd = 'update t_productos set inventario1 = inventario1 + $1 ';
                const whereupd = " where id = $2";
                yield database_1.pool.query(sqlupd + whereupd, [cantidad, idproducto]);
            }
            const sql = "delete from t_holds_items ";
            const where = " where idhold = $1 ";
            yield database_1.pool.query(sql + where, [idhold]);
            const sql2 = "delete from t_holds ";
            const where2 = " where id = " + idhold;
            // console.log(sql2 + where2)
            yield database_1.pool.query(sql2 + where2);
            const data = {
                success: true,
                resp: 'Holds ELIMINADO con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error ELIMINANDO Holds ' + e);
        }
    });
}
exports.deleteHolds = deleteHolds;
function setVenta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idhold, idempresa, tasausd, totalusd, urlintegracion, tokenintegracion } = req.body;
            const igtf = 0;
            const select = "select a.id, a.idcliente, a.idusuario, a.idtipofactura, b.idproducto, b.precio, b.cantidad, b.tasa, b.total, b.idunidad, b.descuento ";
            const from = "from t_holds a, t_holds_items b ";
            let where = " where a.id = b.idhold and a.id = $1";
            const resp = yield database_1.pool.query(select + from + where, [idhold]);
            const itemventa = resp.rows[0];
            const fecha = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            let secuencial = yield getSecuencial(idempresa, itemventa.idtipofactura);
            secuencial = Number(secuencial) + 1;
            const insert = "insert into t_ventas (idcliente, idempresa, idusuario, fecha, idtipofactura, igtf, secuencial, tasausd, totalusd) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
            let respventa = yield database_1.pool.query(insert + values, [itemventa.idcliente, idempresa, itemventa.idusuario, fecha, itemventa.idtipofactura, igtf, secuencial, tasausd, totalusd]);
            const idventa = respventa.rows[0].id;
            let subtotales = 0;
            let impuestos = 0;
            let totales = 0;
            let descuentos = 0;
            console.log(idventa);
            for (const i in resp.rows) {
                const item = resp.rows[i];
                console.log('item');
                console.log(item);
                const impuesto = item.precio * item.tasa / 100;
                impuestos = Number(impuestos) + impuesto;
                const subtotal = item.precio * item.cantidad;
                subtotales = Number(subtotales) + subtotal;
                descuentos = Number(descuentos) + item.descuento;
                totales = Number(totales) + subtotal + impuesto;
                /* console.log(impuesto)
                console.log(subtotal)
                console.log('----------')
                console.log(impuestos)
                console.log(subtotales)
                console.log(totales) */
                const idproducto = item.idproducto;
                const precio = item.precio;
                const cantidad = item.cantidad;
                const tasa = item.tasa;
                const descuento = item.descuento;
                const total = impuesto + subtotal;
                const idunidad = item.idunidad;
                const insert2 = "insert into t_ventas_items (idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad ) ";
                const values2 = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ";
                yield database_1.pool.query(insert2 + values2, [idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad]);
            }
            totales = Number(totales) + igtf;
            const numerointerno = secuencial.toString().padStart(8, '0');
            // AQUI INICIA LA INTEGRACION CON FACTURACION SMART
            // AQUI TERMINA LA INTEGRACION CON FACTURACION SMART
            const sqlupd = 'update t_ventas set subtotal = $1, impuesto = $2, total = $3, descuentos = $4, numerointerno = $5 ';
            const whereupd = " where id = $6";
            yield database_1.pool.query(sqlupd + whereupd, [subtotales, impuestos, totales, descuentos, numerointerno, idventa]);
            const data = {
                success: true,
                resp: {
                    idventa,
                    numerointerno,
                    fecha: itemventa.fecha
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error creando venta ' + e);
        }
    });
}
exports.setVenta = setVenta;
function getSecuencial(idempresa, idtipofactura) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(idempresa, idtipofactura);
        const sql = " SELECT MAX(secuencial) FROM t_ventas ";
        const where = " where idempresa = $1 and idtipofactura = $2 ";
        console.log(sql + where);
        const resp = yield database_1.pool.query(sql + where, [idempresa, idtipofactura]);
        console.log(resp.rows[0].max);
        return resp.rows[0].max || 0;
    });
}
function getVentas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idempresa } = req.params;
            let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev,  ";
            sql += "a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idusuario, a.idtipofactura, d.tipofactura, e.nombre as usuario  ";
            const from = "from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e ";
            let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id and a.idempresa = $1";
            const resp = yield database_1.pool.query(sql + from + where, [idempresa]);
            // console.log( resp.rows)
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Ventas ' + e);
        }
    });
}
exports.getVentas = getVentas;
function getItemsVentas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idventa } = req.params;
            const select = "select a.id as iditemventa, a.idproducto, a.precio, a.cantidad, a.tasa, a.total, a.subtotal, a.idunidad, b.producto ";
            const from = "from t_ventas_items a, t_productos b ";
            let where = " where a.idproducto = b.id and a.idventa = $1";
            const resp = yield database_1.pool.query(select + from + where, [idventa]);
            // console.log( resp.rows)
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando items ventas ' + e);
        }
    });
}
exports.getItemsVentas = getItemsVentas;
function getVenta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idventa } = req.params;
            let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev,  ";
            sql += "a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idtipofactura, d.tipofactura, e.nombre as usuario  ";
            const from = "from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e ";
            let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id and a.id = $1";
            const resp = yield database_1.pool.query(sql + from + where, [idventa]);
            console.log(resp.rows[0]);
            const data = {
                success: true,
                resp: resp.rows[0]
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Consultando Venta ' + e);
        }
    });
}
exports.getVenta = getVenta;
