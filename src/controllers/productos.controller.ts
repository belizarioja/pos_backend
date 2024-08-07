import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getProductos (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idcategoria, idempresa } = req.params;
        const select = "select a.id, a.producto, a.descripcion, a.idcategoria, b.categoria, a.idimpuesto, c.impuesto, c.tasa, a.costo, a.precio, d.unidad, a.idunidad, a.inventario1, a.sku, a.costousd, a,preciousd, a.utilidad, a.intipoproducto ";
        const from = "from t_productos a, t_categorias b, t_impuestos c, t_unidades d ";
        let where = " where a.idcategoria = b.id and b.idempresa = $1 and a.idimpuesto = c.id and a.idunidad = d.id";
        if (Number(idcategoria) > 0) {
            where += " and a.idcategoria = " + idcategoria;
        }
        const resp = await pool.query(select + from + where, [idempresa]);
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
}
export async function getProductosCompuesto (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idproducto } = req.body;
        const select = "select a.id, a.producto, a.descripcion, e.cantidad,  a.idcategoria, b.categoria, a.idimpuesto, c.impuesto, c.tasa, a.costo, a.precio, d.unidad, a.idunidad, a.inventario1, a.sku, a.costousd, a,preciousd, a.utilidad, a.intipoproducto ";
        const from = "from t_productos a, t_categorias b, t_impuestos c, t_unidades d, t_productos_compuesto e ";
        let where = " where a.idcategoria = b.id and a.idimpuesto = c.id and a.idunidad = d.id and a.id=e.idproductohijo ";
        where += " and e.idproductopadre = " + idproducto;
        const resp = await pool.query(select + from + where);
        // console.log( resp.rows)
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);  
        
    }
    catch (e) {
        return res.status(400).send('Error Listando productos simples del compuesto ' + e);
    }
}
export async function setProducto (req: Request, res: Response): Promise<Response | void> {
    try {
        const { producto, descripcion, idcategoria, idimpuesto, idunidad, costo, precio, inventario, sku, costousd, preciousd, utilidad, intipoproducto } = req.body;
      
        const insert = "insert into t_productos (producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad, inventario1, sku, costousd, preciousd, utilidad, intipoproducto) ";
        const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
        await pool.query(insert + values, [producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad, inventario, sku, costousd, preciousd, utilidad, intipoproducto]);
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
}
export async function setProductoCompuesto (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idproductopadre, idproductohijo, idunidad, cantidad } = req.body;
      
        const insert = "insert into t_productos_compuesto (idproductopadre, idproductohijo, idunidad, cantidad) ";
        const values = " values ($1, $2, $3, $4)";
        await pool.query(insert + values, [idproductopadre, idproductohijo, idunidad, cantidad]);
        const data = {
            success: true,
            resp: {
                message: "Producto Simple agregado creado con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Creando producto ' + e);
    }
}
export async function updateProductos (req: Request, res: Response): Promise<Response | void> {
    try {
        const { producto, descripcion, idcategoria, idimpuesto, idunidad, costo, precio, inventario, sku, id, costousd, preciousd, utilidad } = req.body;
      
        const sql = "update t_productos set producto = $1, descripcion = $2, idcategoria = $3, idimpuesto = $4, costo = $5, precio = $6, idunidad = $7, inventario1 = $8, sku = $9, costousd = $10, preciousd = $11, utilidad = $12 ";
        const where = " where id = $13";
        await pool.query(sql + where, [producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad, inventario, sku, costousd, preciousd, utilidad, id]);
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
}
export async function updateCompuesto (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idproductopadre, idproductohijo, cantidad } = req.body;
      
        const sql = "update t_productos_compuesto set cantidad = $1 ";
        const where = " where idproductopadre = $2 and idproductohijo = $3";
        await pool.query(sql + where, [cantidad, idproductopadre, idproductohijo]);
        const data = {
            success: true,
            resp: {
                message: "Producto compuesto actualizado con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Creando producto compuesto' + e);
    }
}

export async function updateInventario (req: Request, res: Response): Promise<Response | void> {
    try {
        const { inventario, idproducto } = req.body;
      
        const sql = "update t_productos set inventario1 = $1 ";
        const where = " where id = $2";
        await pool.query(sql + where, [ inventario, idproducto]);
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
}