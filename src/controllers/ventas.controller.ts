import { Request, Response } from 'express';
import moment from 'moment';

// DB
import { pool } from '../database'

export async function setHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idcliente, idusuario, idtipofactura } = req.body;
        const fecha = moment().format('YYYY-MM-DD HH:mm:ss')
        const insert = "insert into t_holds (idcliente, idusuario, fecha, idtipofactura) ";
        const values = " values ($1, $2, $3, $4) RETURNING id";
        let resp = await pool.query(insert + values, [idcliente, idusuario, fecha, idtipofactura]);
        // console.log(resp.rows[0].id)
        const idhold = resp.rows[0].id
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
}
export async function setItemHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento } = req.body;
        // console.log(idhold, idproducto, precio, cantidad, tasa, total, idunidad)
        
        const selectinventario = "select inventario1 from t_productos where id = $1 ";
        const respinventario = await pool.query(selectinventario, [idproducto]);
        console.log('respinventario.rows[0].inventario1')
        console.log(respinventario.rows[0].inventario1)
        if(Number(respinventario.rows[0].inventario1) === 0) {
            return res.status(202).json( 
                {
                    success: false,
                    resp: 'Producto sin inventario'
                })
        }  
        const sql = "update t_productos set inventario1 = inventario1 - $1 ";
        const whereupd = " where id = $2";
        await pool.query(sql + whereupd, [cantidad, idproducto]);
        
        const insert = "insert into t_holds_items (idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento) ";
        const values = " values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
        let resp = await pool.query(insert + values, [idhold, idproducto, precio, cantidad, tasa, total, idunidad, descuento]);
        // console.log(resp.rows[0].id)
        const iditemhold = resp.rows[0].id
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
}
export async function updItemHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { iditemhold, cantidad, total, idproducto, accion } = req.body;
        console.log(iditemhold, cantidad, total, idproducto)
        let sql = 'update t_productos set '
        if(accion === 1) {
            const selectinventario = "select inventario1 from t_productos where id = $1 ";
            const respinventario = await pool.query(selectinventario, [idproducto]);
            console.log('respinventario.rows[0].inventario1')
            console.log(Number(respinventario.rows[0].inventario1))
            if(Number(respinventario.rows[0].inventario1) === 0) {
                console.log('Aqui 1')
                return res.status(202).json( 
                    {
                        success: true,
                        resp: 'Producto sin inventario'
                    })
            } else {
                console.log('Aqui 2')
                sql += " inventario1 = inventario1 - 1 ";
            }
        } else {
            console.log('Aqui 3')
            sql += " inventario1 = inventario1 + 1 ";
        }
        const whereupd = " where id = $1";
        await pool.query(sql + whereupd, [idproducto]);
        
        const update = "update t_holds_items set cantidad = $1, total = $2 ";
        const where = " where id = $3 ";
        await pool.query(update + where, [cantidad, total, iditemhold]);
        const data = {
            success: true,
            resp: 'Item holds actualizado con éxito'
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error actualizando item holds ' + e);
    }
}

export async function getHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idusuario } = req.params;
        const select = "select a.id as idhold, a.fecha, a.idcliente, b.nombre, b.documento, c.abrev  ";
        const from = "from t_holds a, t_clientes b, t_tipodocumentos c ";
        let where = " where a.idcliente = b.id and b.idtipodocumento = c.id and a.idusuario = $1";
        const resp = await pool.query(select + from + where, [idusuario]);
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
}
export async function getItemsHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idholds } = req.params;

        const select = "select a.id as iditemhold, a.idproducto, a.precio, a.cantidad, a.tasa, a.total, a.idunidad, b.producto, b.idcategoria, c.categoria ";
        const from = "from t_holds_items a, t_productos b, t_categorias c ";
        let where = " where a.idproducto = b.id and b.idcategoria = c.id and a.idhold = $1";
        const resp = await pool.query(select + from + where, [idholds]);
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
}

export async function deleteItemHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { iditemhold, cantidad, idproducto } = req.body;
        // console.log(iditemhold, cantidad)
        const sqlupd = 'update t_productos set inventario1 = inventario1 + $1 '        
        const whereupd = " where id = $2";
        await pool.query(sqlupd + whereupd, [cantidad, idproducto]);
        
        const sql = "delete from t_holds_items ";
        const where = " where id = $1 ";
        await pool.query(sql + where, [iditemhold]);
        const data = {
            success: true,
            resp: 'Item holds ELIMINADO con éxito'
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error ELIMINANDO item holds ' + e);
    }
}

export async function deleteHolds (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idhold } = req.params;
        
        const select = "select id, idproducto, cantidad ";
        const from = "from t_holds_items ";
        let where1 = " where idhold = $1";
        const resp = await pool.query(select + from + where1, [idhold]);
        console.log( resp.rows)
        for (let i = 0; i < resp.rows.length; i++) {
            const idproducto = resp.rows[i].idproducto
            const cantidad = resp.rows[i].cantidad            
            const sqlupd = 'update t_productos set inventario1 = inventario1 + $1 '        
            const whereupd = " where id = $2";
            await pool.query(sqlupd + whereupd, [cantidad, idproducto]);
        }
        
        const sql = "delete from t_holds_items ";
        const where = " where idhold = $1 ";
        await pool.query(sql + where, [idhold]);
        
        const sql2 = "delete from t_holds ";
        const where2 = " where id = " + idhold;
        // console.log(sql2 + where2)
        await pool.query(sql2 + where2);
        const data = {
            success: true,
            resp: 'Holds ELIMINADO con éxito'
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error ELIMINANDO Holds ' + e);
    }
}

export async function setVenta (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idhold, idempresa, tasausd, totalusd, urlintegracion, tokenintegracion } = req.body;
        const igtf = 0
        const select = "select a.id, a.idcliente, a.idusuario, a.idtipofactura, b.idproducto, b.precio, b.cantidad, b.tasa, b.total, b.idunidad, b.descuento ";
        const from = "from t_holds a, t_holds_items b ";
        let where = " where a.id = b.idhold and a.id = $1";
        const resp = await pool.query(select + from + where, [idhold]);
        const itemventa = resp.rows[0]
        const fecha = moment().format('YYYY-MM-DD HH:mm:ss')
        let secuencial = await getSecuencial(idempresa, itemventa.idtipofactura)
        secuencial = Number(secuencial) + 1

        const insert = "insert into t_ventas (idcliente, idempresa, idusuario, fecha, idtipofactura, igtf, secuencial, tasausd, totalusd) ";
        const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
        let respventa = await pool.query(insert + values, [itemventa.idcliente, idempresa, itemventa.idusuario, fecha, itemventa.idtipofactura, igtf, secuencial, tasausd, totalusd]);
        const idventa = respventa.rows[0].id
        let subtotales = 0
        let impuestos = 0
        let totales = 0
        let descuentos = 0
        console.log(idventa)
        for (const i in resp.rows) {
            const item = resp.rows[i]
            console.log('item')
            console.log(item)

            const impuesto = item.precio * item.tasa / 100
            impuestos  = Number(impuestos) + impuesto
            const subtotal = item.precio * item.cantidad
            subtotales = Number(subtotales) + subtotal
            descuentos = Number(descuentos) + item.descuento
            totales = Number(totales) + subtotal + impuesto
            /* console.log(impuesto)
            console.log(subtotal)
            console.log('----------')
            console.log(impuestos)
            console.log(subtotales)
            console.log(totales) */
            const idproducto = item.idproducto
            const precio = item.precio
            const cantidad = item.cantidad
            const tasa = item.tasa
            const descuento = item.descuento
            const total = impuesto + subtotal
            const idunidad = item.idunidad

            const insert2 = "insert into t_ventas_items (idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad ) ";
            const values2 = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ";
            await pool.query(insert2 + values2, [idventa, idproducto, precio, cantidad, impuesto, tasa, subtotal, descuento, total, idunidad ]);
            
        }
        totales = Number(totales) + igtf
        const numerointerno = secuencial.toString().padStart(8, '0')

        // AQUI INICIA LA INTEGRACION CON FACTURACION SMART
        
        // AQUI TERMINA LA INTEGRACION CON FACTURACION SMART
        
        const sqlupd = 'update t_ventas set subtotal = $1, impuesto = $2, total = $3, descuentos = $4, numerointerno = $5 '        
        const whereupd = " where id = $6";
        await pool.query(sqlupd + whereupd, [subtotales, impuestos, totales, descuentos, numerointerno, idventa]);

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
}
async function getSecuencial (idempresa: any, idtipofactura: any) {

    console.log(idempresa, idtipofactura)
    const sql = " SELECT MAX(secuencial) FROM t_ventas ";
    const where = " where idempresa = $1 and idtipofactura = $2 ";
    console.log(sql + where);
    const resp = await pool.query(sql + where, [idempresa, idtipofactura]);
    console.log(resp.rows[0].max);
    return resp.rows[0].max || 0

}


export async function getVentas (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idempresa } = req.params;
        let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev,  ";
        sql += "a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idusuario, a.idtipofactura, d.tipofactura, e.nombre as usuario  ";
        const from = "from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e ";
        let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id and a.idempresa = $1";
        const resp = await pool.query(sql + from + where, [idempresa]);
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
}

export async function getItemsVentas (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idventa } = req.params;

        const select = "select a.id as iditemventa, a.idproducto, a.precio, a.cantidad, a.tasa, a.total, a.subtotal, a.idunidad, b.producto ";
        const from = "from t_ventas_items a, t_productos b ";
        let where = " where a.idproducto = b.id and a.idventa = $1";
        const resp = await pool.query(select + from + where, [idventa]);
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
}


export async function getVenta (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idventa } = req.params;
        let sql = "select a.id, a.fecha, a.idcliente, a.numerointerno, a.numerocontrol, b.nombre as nombrecliente, b.documento, c.abrev,  ";
        sql += "a.subtotal, a.impuesto, a.total, a.totalusd, a.igtf, a.descuentos, a.idtipofactura, d.tipofactura, e.nombre as usuario  ";
        const from = "from t_ventas a, t_clientes b, t_tipodocumentos c, t_tipofacturas d, t_usuarios e ";
        let where = " where a.idcliente = b.id and a.idusuario = e.id and b.idtipodocumento = c.id and a.idtipofactura = d.id and a.id = $1";
        const resp = await pool.query(sql + from + where, [idventa]);
        console.log( resp.rows[0])
        const data = {
            success: true,
            resp: resp.rows[0]
        };
        return res.status(200).json(data);  
        
    }
    catch (e) {
        return res.status(400).send('Error Consultando Venta ' + e);
    }
}