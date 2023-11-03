import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getProductos (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idcategoria, idempresa } = req.params;
        console.log('idcategoria')
        console.log(idcategoria)
        const select = "select a.id, a.producto, a.descripcion, b.categoria, c.impuesto, c.tasa, a.costo, a.precio, d.unidad  ";
        const from = "from t_productos a, t_categorias b, t_impuestos c, t_unidades d ";
        let where = " where a.idcategoria = b.id and b.idempresa = $1 and a.idimpuesto = c.id and a.idunidad = d.id";
        if (Number(idcategoria) > 0) {
            where += " and a.idcategoria = " + idcategoria;
        }
        const resp = await pool.query(select + from + where, [idempresa]);
        console.log( resp.rows)
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
export async function setProductos (req: Request, res: Response): Promise<Response | void> {
    try {
        const { producto, descripcion, idcategoria, idimpuesto, idunidad, costo, precio } = req.body;
      
        const insert = "insert into t_productos (producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad) ";
        const values = " values ($1, $2, $3, $4, $5, $6, $7)";
        await pool.query(insert + values, [producto, descripcion, idcategoria, idimpuesto, costo, precio, idunidad]);
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