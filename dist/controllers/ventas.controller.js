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
exports.setNotaCredito = exports.updVenta = exports.anularVenta = exports.getVentaNumeroInterno = exports.getVenta = exports.getItemsVentas = exports.getVentas = exports.setVenta = exports.deleteHolds = exports.deleteItemHolds = exports.getItemsHolds = exports.getHolds = exports.updPrecioItemHolds = exports.updComentarioItemHolds = exports.updItemHolds = exports.setItemHolds = exports.setHolds = void 0;
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
// DB
const database_1 = require("../database");
let ERRORINT = '';
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
            const { idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento, intipoproducto } = req.body;
            // console.log(idhold, idproducto, precio, cantidad, tasa, total, idunidad)
            // console.log('intipoproducto, cantidad')
            // console.log(intipoproducto, cantidad)
            if (intipoproducto < 3) {
                // VERIFIFAR SI HAY STOCK O NO DEL PRODUCTO PRINCIPAL SIMPLE O COMPUESTO
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
            }
            if (Number(intipoproducto) === 2) { // PRODUCTO COMPUESTO
                // SELECCIONAR LOS PRODUCTOS SIMPLES QUE FORMAN EL COMPUESTO
                const selectsimples = "select * from t_productos_compuesto where idproductopadre = $1 ";
                const respsimples = yield database_1.pool.query(selectsimples, [idproducto]);
                console.log(respsimples.rows);
                for (const i in respsimples.rows) {
                    const simple = respsimples.rows[i];
                    const cantidadRestar = cantidad * simple.cantidad;
                    const idsimple = simple.idproductohijo;
                    // console.log(cantidadRestar)
                    // SE DESCUENTAN DE LOS SIMPLES, TEMPORALMENTE, LA CANTIDAD CORRESPONDIENTE EN STOCK
                    const sqlsimple = "update t_productos set inventario1 = inventario1 - $1 ";
                    const whereupdsimple = " where id = $2";
                    yield database_1.pool.query(sqlsimple + whereupdsimple, [cantidadRestar, idsimple]);
                }
            }
            if (intipoproducto < 3) {
                // SE DESCUENTAN TEMPORALMENTE, DEL PRODUCTO PRINCIPAL SIMPLE O COMPUESTO, LA CANTIDAD CORRESPONDIENTE EN STOCK
                const sql = "update t_productos set inventario1 = inventario1 - $1 ";
                const whereupd = " where id = $2";
                yield database_1.pool.query(sql + whereupd, [cantidad, idproducto]);
            }
            // SE CREA EL ITEM DETALLE DEL HOLD TEMPORAL
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
            const { iditemhold, cantidad, total, idproducto, accion, intipoproducto } = req.body;
            // console.log('intipoproducto, cantidad')
            // console.log(intipoproducto, cantidad)
            if (Number(intipoproducto) === 2) { // PRODUCTO COMPUESTO
                // SELECCIONAR LOS PRODUCTOS SIMPLES QUE FORMAN EL COMPUESTO
                const selectsimples = "select * from t_productos_compuesto where idproductopadre = $1 ";
                const respsimples = yield database_1.pool.query(selectsimples, [idproducto]);
                // console.log(respsimples.rows)
                for (const i in respsimples.rows) {
                    const simple = respsimples.rows[i];
                    const cantidadRestar = simple.cantidad;
                    const idsimple = simple.idproductohijo;
                    // console.log(cantidadRestar)
                    // SE DESCUENTAN o SUMAN DE LOS SIMPLES, LA CANTIDAD CORRESPONDIENTE EN STOCK
                    let sqlsimple = "update t_productos  ";
                    if (accion === 1) {
                        sqlsimple += " set inventario1 = inventario1 - $1 ";
                    }
                    else {
                        sqlsimple += " set inventario1 = inventario1 + $1 ";
                    }
                    const whereupdsimple = " where id = $2";
                    yield database_1.pool.query(sqlsimple + whereupdsimple, [cantidadRestar, idsimple]);
                }
            }
            if (Number(intipoproducto) < 3) { // PRODUCTO SERVICIO
                let sql = 'update t_productos set ';
                if (accion === 1) {
                    const selectinventario = "select inventario1 from t_productos where id = $1 ";
                    const respinventario = yield database_1.pool.query(selectinventario, [idproducto]);
                    // console.log('respinventario.rows[0].inventario1')
                    // console.log(Number(respinventario.rows[0].inventario1))
                    if (Number(respinventario.rows[0].inventario1) === 0) {
                        // console.log('Aqui 1')
                        return res.status(202).json({
                            success: true,
                            resp: 'Producto sin inventario'
                        });
                    }
                    else {
                        // console.log('Aqui 2')
                        sql += " inventario1 = inventario1 - 1 ";
                    }
                }
                else {
                    // console.log('Aqui 3')
                    sql += " inventario1 = inventario1 + 1 ";
                }
                const whereupd = " where id = $1";
                yield database_1.pool.query(sql + whereupd, [idproducto]);
            }
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
function updComentarioItemHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { iditemhold, comentario } = req.body;
            // console.log('intipoproducto, cantidad')
            // console.log(intipoproducto, cantidad)
            const update = "update t_holds_items set comentario = $1 ";
            const where = " where id = $2 ";
            yield database_1.pool.query(update + where, [comentario, iditemhold]);
            const data = {
                success: true,
                resp: 'Comentario de Item holds actualizado con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error actualizando comentario de item holds ' + e);
        }
    });
}
exports.updComentarioItemHolds = updComentarioItemHolds;
function updPrecioItemHolds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { iditemhold, precio, total } = req.body;
            // console.log('intipoproducto, cantidad')
            // console.log(intipoproducto, cantidad)
            const update = "update t_holds_items set precio = $1, total = $2 ";
            const where = " where id = $3 ";
            yield database_1.pool.query(update + where, [precio, total, iditemhold]);
            const data = {
                success: true,
                resp: 'Precio de Item holds actualizado con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error actualizando comentario de item holds ' + e);
        }
    });
}
exports.updPrecioItemHolds = updPrecioItemHolds;
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
            const select = "select a.id as iditemhold, a.idproducto, a.comentario, a.precio, a.precio as precioreal, a.cantidad, a.tasa, a.total, a.idunidad, b.intipoproducto, b.producto, b.idcategoria, c.categoria ";
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
            const { iditemhold, cantidad, idproducto, intipoproducto } = req.body;
            // console.log(iditemhold, cantidad)
            if (Number(intipoproducto) === 2) { // PRODUCTO COMPUESTO
                // SELECCIONAR LOS PRODUCTOS SIMPLES QUE FORMAN EL COMPUESTO
                const selectsimples = "select * from t_productos_compuesto where idproductopadre = $1 ";
                const respsimples = yield database_1.pool.query(selectsimples, [idproducto]);
                // console.log(respsimples.rows)
                for (const i in respsimples.rows) {
                    const simple = respsimples.rows[i];
                    const cantidadSumar = simple.cantidad * cantidad;
                    const idsimple = simple.idproductohijo;
                    // console.log(cantidadSumar)
                    // SE SUMAN DE LOS SIMPLES, LA CANTIDAD CORRESPONDIENTE EN STOCK
                    let sqlsimple = "update t_productos  ";
                    sqlsimple += " set inventario1 = inventario1 + $1 ";
                    const whereupdsimple = " where id = $2";
                    yield database_1.pool.query(sqlsimple + whereupdsimple, [cantidadSumar, idsimple]);
                }
            }
            if (Number(intipoproducto) < 3) { // PRODUCTO SERVICIO
                const sqlupd = 'update t_productos set inventario1 = inventario1 + $1 ';
                const whereupd = " where id = $2";
                yield database_1.pool.query(sqlupd + whereupd, [cantidad, idproducto]);
            }
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
            const { idhold, accion } = req.body;
            if (accion === 1) {
                const select = "select id, idproducto, cantidad ";
                const from = "from t_holds_items ";
                let where1 = " where idhold = $1";
                const resp = yield database_1.pool.query(select + from + where1, [idhold]);
                // console.log( resp.rows)
                for (let i = 0; i < resp.rows.length; i++) {
                    const idproducto = resp.rows[i].idproducto;
                    const cantidad = resp.rows[i].cantidad;
                    const sqlupd = 'update t_productos set inventario1 = inventario1 + $1 ';
                    const whereupd = " where id = $2";
                    yield database_1.pool.query(sqlupd + whereupd, [cantidad, idproducto]);
                }
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
            const { idhold, idempresa, tasausd, totalusd, relacionado, formadepago, abono, fechavence, observacion } = req.body;
            const baseigtf = 0;
            const igtf = 0;
            yield database_1.pool.query('BEGIN');
            let select = "select a.id, a.idcliente, a.idusuario, a.idtipofactura, b.idproducto, b.precio, b.cantidad, b.tasa, b.total, b.idunidad ";
            select += ", b.descuento, b.comentario, d.rif, d.urlfacturacion, d.tokenfacturacion, d.tipomoneda, e.*, f.producto, f.sku  ";
            const from = "from t_holds a, t_holds_items b, t_usuarios c, t_empresas d, t_clientes e, t_productos f ";
            let where = " where a.id = b.idhold and a.idusuario = c.id and c.idempresa = d.id and a.idcliente = e.id and b.idproducto = f.id and a.id = $1";
            const resp = yield database_1.pool.query(select + from + where, [idhold]);
            const itemventa = resp.rows[0];
            // console.log(itemventa)
            // console.log('itemventa.idtipofactura')
            // console.log(itemventa.idtipofactura)
            const fecha = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            let secuencial = yield getSecuencial(idempresa, itemventa.idtipofactura);
            secuencial = Number(secuencial) + 1;
            // console.log('secuencial', secuencial)
            const insert = "insert into t_ventas (idcliente, idempresa, idusuario, fecha, idtipofactura, igtf, secuencial, tasausd, totalusd, formadepago, abono, fechavence, observacion) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id";
            let respventa = yield database_1.pool.query(insert + values, [itemventa.idcliente, idempresa, itemventa.idusuario, fecha, itemventa.idtipofactura, igtf, secuencial, tasausd, totalusd, formadepago, abono, fechavence, observacion]);
            const idventa = respventa.rows[0].id;
            let subtotales = 0;
            let impuestos = 0;
            let totales = 0;
            let descuentos = 0;
            let exentos = 0;
            let impr = 0;
            let impg = 0;
            let impa = 0;
            let tasar = 0;
            let tasag = 0;
            let tasaa = 0;
            let baser = 0;
            let baseg = 0;
            let basea = 0;
            // console.log(idventa)
            const cuerpofactura = [];
            for (const i in resp.rows) {
                const item = resp.rows[i];
                // console.log('item')
                // console.log(item)
                const impuesto = item.precio * (item.tasa / 100) * item.cantidad;
                impuestos = Number(impuestos) + impuesto;
                const subtotal = item.precio * item.cantidad;
                subtotales = Number(subtotales) + subtotal;
                descuentos = Number(descuentos) + item.descuento;
                totales = Number(totales) + subtotal + impuesto;
                const idproducto = item.idproducto;
                const precio = item.precio;
                const cantidad = item.cantidad;
                const tasa = item.tasa;
                if (Number(tasa) === 0) {
                    exentos += subtotal;
                }
                if (Number(tasa) === 16) {
                    tasag = Number(tasa);
                    impg += Number(impuesto);
                    baseg += subtotal;
                }
                if (Number(tasa) === 8) {
                    tasar = Number(tasa);
                    impr += impuesto;
                    baser += subtotal;
                }
                if (Number(tasa) === 31) {
                    tasaa = Number(tasa);
                    impa += impuesto;
                    basea += subtotal;
                }
                const descuento = item.descuento;
                const total = subtotal + impuesto;
                const idunidad = item.idunidad;
                const comentario = item.comentario || '';
                const insert2 = "insert into t_ventas_items (idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad, comentario ) ";
                const values2 = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ";
                yield database_1.pool.query(insert2 + values2, [idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad, comentario]);
                const obj = {
                    codigo: item.sku || '000' + (Number(i) + 1),
                    descripcion: item.producto,
                    comentario: item.comentario || '',
                    precio: Number(item.precio),
                    cantidad: Number(item.cantidad),
                    tasa: Number(tasa),
                    descuento: Number(item.descuento),
                    exento: Number(tasa) === 0 || false,
                    monto: Number(subtotal)
                };
                cuerpofactura.push(obj);
            }
            totales = Number(totales) + igtf;
            const numerointerno = secuencial.toString().padStart(8, '0');
            let numerocontrol = '00-' + numerointerno;
            // AQUI INICIA
            // LA INTEGRACION
            // CON FACTURACION SMART
            // console.log('itemventa.urlfacturacion')
            // console.log(itemventa.urlfacturacion)
            if (itemventa.urlfacturacion && (itemventa.tokenfacturacion.length > 0 && itemventa.urlfacturacion.length > 0)) {
                const trackingid = yield generateRandomString();
                const jsonbody = {
                    rif: itemventa.rif,
                    trackingid: trackingid,
                    nombrecliente: itemventa.nombre,
                    rifcedulacliente: itemventa.documento,
                    direccioncliente: itemventa.direccion,
                    telefonocliente: itemventa.telefono,
                    emailcliente: itemventa.correo,
                    sucursal: itemventa.sucursal || '',
                    numerointerno: numerointerno,
                    relacionado: relacionado || '',
                    fechavence: fechavence || '',
                    idtipodocumento: itemventa.idtipofactura,
                    subtotal: subtotales,
                    exento: exentos,
                    tasag: tasag,
                    baseg: baseg,
                    impuestog: impg,
                    tasar: tasar,
                    baser: baser,
                    impuestor: impr,
                    tasaa: tasaa,
                    basea: basea,
                    impuestoa: impa,
                    tasaigtf: 3,
                    baseigtf: baseigtf,
                    impuestoigtf: igtf,
                    total: totales,
                    tasacambio: tasausd > 0 ? Number(tasausd) : undefined,
                    idtipocedulacliente: itemventa.idtipodocumento || 1,
                    tipomoneda: itemventa.tipomoneda || 1,
                    sendmail: 1,
                    cuerpofactura: cuerpofactura,
                    observacion: observacion.length > 0 ? observacion : undefined
                    // formasdepago: [],
                };
                const respintegracion = yield setIntegracion(jsonbody, itemventa.tokenfacturacion, itemventa.urlfacturacion);
                // console.log('respintegracion')
                // console.log(respintegracion)
                if (respintegracion) {
                    numerocontrol = respintegracion.numerodocumento;
                }
                else {
                    yield database_1.pool.query('ROLLBACK');
                    const data = {
                        success: false,
                        resp: {
                            message: ERRORINT
                        }
                    };
                    return res.status(202).json(data);
                }
            }
            // AQUI TERMINA 
            // LA INTEGRACION
            // CON FACTURACION SMART
            const sqlupd = 'update t_ventas set subtotal = $1, impuesto = $2, total = $3, descuentos = $4, numerointerno = $5, numerocontrol = $6 ';
            const whereupd = " where id = $7";
            yield database_1.pool.query(sqlupd + whereupd, [subtotales, impuestos, totales, descuentos, numerointerno, numerocontrol, idventa]);
            yield database_1.pool.query('COMMIT');
            const data = {
                success: true,
                resp: {
                    idventa,
                    numerointerno,
                    numerocontrol,
                    fecha
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
function setIntegracion(jsonbody, token, url) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(jsonbody)
        // console.log(token)
        // console.log(url)
        const headersjwt = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
        const resp = yield axios_1.default.post(url, jsonbody, headersjwt);
        // console.log(resp.data)
        if (resp.data.success) {
            // console.log(resp.data.data)
            return resp.data.data;
        }
        else {
            console.log(resp.data.error.message);
            ERRORINT = resp.data.error.message;
            return false;
        }
    });
}
function setIntegracionAnular(jsonbody, token, url) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(jsonbody)
        // console.log(token)
        // console.log(url)
        const headersjwt = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
        const resp = yield axios_1.default.post(url, jsonbody, headersjwt);
        // console.log(resp.data)
        if (resp.data.success) {
            // console.log(resp.data.success)
            return resp.data.success;
        }
        else {
            console.log(resp.data.error.message);
            ERRORINT = resp.data.error.message;
            return false;
        }
    });
}
function generateRandomString() {
    return __awaiter(this, void 0, void 0, function* () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 9; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result1;
    });
}
function getSecuencial(idempresa, idtipofactura) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(idempresa, idtipofactura);
        const sql = " SELECT MAX(secuencial) FROM t_ventas ";
        const where = " where idempresa = $1 and idtipofactura = $2 ";
        // console.log(sql + where);
        const resp = yield database_1.pool.query(sql + where, [idempresa, idtipofactura]);
        // console.log('MAX(secuencial): ', resp.rows[0].max);
        return resp.rows[0].max || 0;
    });
}
function getVentas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idempresa, desde, hasta, formadepago } = req.body;
            let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev, a.estatus, a.formadepago, a.abono, a.fechavence, ";
            sql += "a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idusuario, a.idtipofactura, d.tipofactura, e.nombre as usuario, a.relacionado  ";
            const from = "from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e ";
            let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id and a.idempresa = $1";
            if (formadepago) {
                where += " and a.formadepago= " + formadepago;
            }
            if (desde.length > 0) {
                where += " and to_char(a.fecha, 'YYYY-MM-DD') >= '" + desde + "' and to_char(a.fecha, 'YYYY-MM-DD') <= '" + hasta + "'";
            }
            const orderby = " order by a.fecha desc ";
            const resp = yield database_1.pool.query(sql + from + where + orderby, [idempresa]);
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
function obtenerItemsVentas(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const select = "select a.id as iditemventa, a.idproducto, a.precio, a.cantidad, a.tasa, a.impuesto, a.total, a.subtotal, a.descuento, a.idunidad, a.comentario, b.producto, b.sku  ";
        const from = "from t_ventas_items a, t_productos b ";
        let where = " where a.idproducto = b.id and a.idventa = $1";
        const resp = yield database_1.pool.query(select + from + where, [id]);
        // console.log( 'resp.rows')
        // console.log( resp.rows)
        return resp;
    });
}
function getItemsVentas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idventa } = req.params;
            /* const select = "select a.id as iditemventa, a.idproducto, a.precio, a.cantidad, a.tasa, a.total, a.subtotal, a.idunidad, b.producto ";
            const from = "from t_ventas_items a, t_productos b ";
            let where = " where a.idproducto = b.id and a.idventa = $1";
            const resp = await pool.query(select + from + where, [idventa]); */
            const resp = yield obtenerItemsVentas(idventa);
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
            // console.log( resp.rows[0])
            const dataventa = resp.rows[0];
            const data = {
                success: true,
                resp: dataventa
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Consultando Venta ' + e);
        }
    });
}
exports.getVenta = getVenta;
function getVentaNumeroInterno(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idempresa, idtipofactura, numerointerno } = req.params;
            let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev, a.estatus, ";
            sql += "a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idtipofactura, d.tipofactura, e.nombre as usuario  ";
            const from = "from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e ";
            let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id ";
            where += " and a.idempresa = $1 and a.idtipofactura = $2 and a.numerointerno = $3 ";
            const resp = yield database_1.pool.query(sql + from + where, [idempresa, idtipofactura, numerointerno]);
            // console.log(resp.rows)
            if (resp.rows.length > 0) {
                const respdetalles = yield obtenerItemsVentas(resp.rows[0].id);
                // console.log(respdetalles)
                const data = {
                    success: true,
                    resp: resp.rows[0],
                    respdetalles: respdetalles.rows
                };
                return res.status(200).json(data);
            }
            else {
                const data = {
                    success: false,
                    resp: null
                };
                return res.status(202).json(data);
            }
        }
        catch (e) {
            return res.status(400).send('Error Consultando Venta y detalles por numero interno ' + e);
        }
    });
}
exports.getVentaNumeroInterno = getVentaNumeroInterno;
function anularVenta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idventa, numerocontrol, rifempresa, urlfacturacion, tokenfacturacion } = req.body;
            yield database_1.pool.query('BEGIN');
            // AQUI INICIA
            // LA INTEGRACION PARA ANULAR
            // CON FACTURACION SMART
            if (urlfacturacion && (tokenfacturacion.length > 0 && urlfacturacion.length > 0)) {
                const jsonbody = {
                    numerodocumento: numerocontrol,
                    observacion: 'Se anula documento',
                    rif: rifempresa
                    // formasdepago: [],
                };
                const newurl = urlfacturacion.replace('/facturacion', '/anulacion');
                const respintegracion = yield setIntegracionAnular(jsonbody, tokenfacturacion, newurl);
                // console.log('respintegracion')
                // console.log(respintegracion)
                if (!respintegracion) {
                    yield database_1.pool.query('ROLLBACK');
                    const data = {
                        success: false,
                        resp: {
                            message: ERRORINT
                        }
                    };
                    return res.status(202).json(data);
                }
            }
            const sqlupd = 'update t_ventas set estatus = 2 where id = $1';
            yield database_1.pool.query(sqlupd, [idventa]);
            // LIBERAR INVENTARIO
            const select = "select id, idproducto, cantidad from t_ventas_items where idventa = $1";
            const resp = yield database_1.pool.query(select, [idventa]);
            // console.log( resp.rows)
            for (let i = 0; i < resp.rows.length; i++) {
                const idproducto = resp.rows[i].idproducto;
                const cantidad = resp.rows[i].cantidad;
                const sqlupd2 = 'update t_productos set inventario1 = inventario1 + $1 where id = $2';
                yield database_1.pool.query(sqlupd2, [cantidad, idproducto]);
            }
            yield database_1.pool.query('COMMIT');
            const data = {
                success: true,
                resp: 'Venta anulada con éxito'
            };
            return res.status(202).json(data);
        }
        catch (e) {
            return res.status(400).send('Error anulando Venta >>>>>> ' + e);
        }
    });
}
exports.anularVenta = anularVenta;
function updVenta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idventa, abono } = req.body;
            // console.log('intipoproducto, cantidad')
            // console.log(intipoproducto, cantidad)
            const update = "update t_ventas set abono = abono + $1 ";
            const where = " where id = $2 ";
            yield database_1.pool.query(update + where, [abono, idventa]);
            const data = {
                success: true,
                resp: 'Venta actualizada con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error actualizando item holds ' + e);
        }
    });
}
exports.updVenta = updVenta;
function setNotaCredito(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idventa, idempresa } = req.body;
            yield database_1.pool.query('BEGIN');
            let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev, b.direccion as direccioncliente, b.telefono as telefonocliente, b.correo as correocliente, f.tipomoneda, ";
            sql += " a.tasausd, a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idtipofactura, d.tipofactura, a.idusuario, e.nombre as usuario, f.rif, f.urlfacturacion, f.tokenfacturacion, a.formadepago, a.observacion  ";
            const from = " from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e, t_empresas f ";
            let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id and a.idempresa = f.id and a.id = $1";
            const resp = yield database_1.pool.query(sql + from + where, [idventa]);
            // console.log( resp.rows[0])
            // const dataventa = resp.rows[0]
            const idtipofactura = 3; // NOTA DE CREDITO
            const itemventa = resp.rows[0];
            console.log(itemventa);
            const fecha = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            let secuencial = yield getSecuencial(idempresa, idtipofactura);
            secuencial = Number(secuencial) + 1;
            console.log('secuencial', secuencial);
            const insert = "insert into t_ventas (idcliente, idempresa, idusuario, fecha, idtipofactura, subtotal, impuesto, total, descuentos, igtf, secuencial, tasausd, totalusd, formadepago, observacion, relacionado) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id";
            let respventa = yield database_1.pool.query(insert + values, [itemventa.idcliente, idempresa, itemventa.idusuario, fecha, idtipofactura, itemventa.subtotal, itemventa.impuesto, itemventa.total, itemventa.descuentos, itemventa.igtf, secuencial, itemventa.tasausd, itemventa.totalusd, itemventa.formadepago, itemventa.observacion, itemventa.numerocontrol]);
            const idventanew = respventa.rows[0].id;
            console.log('idventanew', idventanew);
            const respitemsventa = yield obtenerItemsVentas(idventa);
            let subtotales = 0;
            let impuestos = 0;
            let totales = 0;
            let descuentos = 0;
            let exentos = 0;
            let impr = 0;
            let impg = 0;
            let impa = 0;
            let tasar = 0;
            let tasag = 0;
            let tasaa = 0;
            let baser = 0;
            let baseg = 0;
            let basea = 0;
            const cuerpofactura = [];
            for (const i in respitemsventa.rows) {
                const item = respitemsventa.rows[i];
                console.log('item');
                console.log(item);
                const idproducto = item.idproducto;
                const precio = item.precio;
                const cantidad = item.cantidad;
                const tasa = item.tasa;
                const descuento = item.descuento;
                const idunidad = item.idunidad;
                const subtotal = item.subtotal;
                const total = item.total;
                const impuesto = item.impuesto;
                const comentario = item.comentario || '';
                if (Number(tasa) === 0) {
                    exentos += subtotal;
                }
                if (Number(tasa) === 16) {
                    tasag = Number(tasa);
                    impg += impuesto;
                    baseg += subtotal;
                }
                if (Number(tasa) === 8) {
                    tasar = Number(tasa);
                    impr += impuesto;
                    baser += subtotal;
                }
                if (Number(tasa) === 31) {
                    tasaa = Number(tasa);
                    impa += impuesto;
                    basea += subtotal;
                }
                // console.log('impg: ', impg)
                const insert2 = "insert into t_ventas_items (idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad, comentario ) ";
                const values2 = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ";
                yield database_1.pool.query(insert2 + values2, [idventanew, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad, comentario]);
                const obj = {
                    codigo: item.sku || '000' + (Number(i) + 1),
                    descripcion: item.producto,
                    comentario: item.comentario || '',
                    precio: Number(item.precio),
                    cantidad: Number(item.cantidad),
                    tasa: Number(tasa),
                    descuento: Number(item.descuento),
                    exento: Number(tasa) === 0 || false,
                    monto: Number(subtotal)
                };
                cuerpofactura.push(obj);
            }
            // totales = Number(totales) + igtf
            const numerointerno = secuencial.toString().padStart(8, '0');
            let numerocontrol = '00-' + numerointerno;
            // AQUI INICIA
            // LA INTEGRACION
            // CON FACTURACION SMART
            // console.log('itemventa.urlfacturacion')
            // console.log(itemventa.urlfacturacion)
            if (itemventa.urlfacturacion && (itemventa.tokenfacturacion.length > 0 && itemventa.urlfacturacion.length > 0)) {
                const trackingid = yield generateRandomString();
                const jsonbody = {
                    rif: itemventa.rif,
                    trackingid: trackingid,
                    nombrecliente: itemventa.nombrecliente,
                    rifcedulacliente: itemventa.documento,
                    direccioncliente: itemventa.direccioncliente,
                    telefonocliente: itemventa.telefonocliente,
                    emailcliente: itemventa.correocliente,
                    sucursal: itemventa.sucursal || '',
                    numerointerno: numerointerno,
                    relacionado: itemventa.numerocontrol || '',
                    idtipodocumento: idtipofactura,
                    subtotal: itemventa.subtotal,
                    exento: exentos,
                    tasag: tasag,
                    baseg: baseg,
                    impuestog: impg,
                    tasar: tasar,
                    baser: baser,
                    impuestor: impr,
                    tasaa: tasaa,
                    basea: basea,
                    impuestoa: impa,
                    tasaigtf: 3,
                    baseigtf: itemventa.igtf / 3 / 100,
                    impuestoigtf: itemventa.igtf,
                    total: itemventa.total,
                    tasacambio: itemventa.tasausd > 0 ? Number(itemventa.tasausd) : undefined,
                    idtipocedulacliente: itemventa.idtipodocumento || 1,
                    tipomoneda: itemventa.tipomoneda || 1,
                    sendmail: 1,
                    cuerpofactura: cuerpofactura,
                    formasdepago: [{
                            forma: 'Nota de Crédito',
                            valor: Number(totales)
                        }],
                    // observacion: obs.length > 0 ? obs : undefined
                };
                const respintegracion = yield setIntegracion(jsonbody, itemventa.tokenfacturacion, itemventa.urlfacturacion);
                // console.log('respintegracion')
                // console.log(respintegracion)
                if (respintegracion) {
                    numerocontrol = respintegracion.numerodocumento;
                }
                else {
                    yield database_1.pool.query('ROLLBACK');
                    const data = {
                        success: false,
                        resp: {
                            message: ERRORINT
                        }
                    };
                    return res.status(202).json(data);
                }
            }
            // AQUI TERMINA 
            // LA INTEGRACION
            // CON FACTURACION SMART
            const sqlupd = 'update t_ventas set numerointerno = $1, numerocontrol = $2 ';
            const whereupd = " where id = $3";
            yield database_1.pool.query(sqlupd + whereupd, [numerointerno, numerocontrol, idventanew]);
            yield database_1.pool.query('COMMIT');
            const data = {
                success: true,
                resp: {
                    idventanew,
                    numerointerno,
                    numerocontrol,
                    fecha
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error creando venta ' + e);
        }
    });
}
exports.setNotaCredito = setNotaCredito;
