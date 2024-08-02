import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getConfiguracion (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req.params;
        const sql = "select id, tasabcv, urlfacturacion, tokenfacturacion, empresa, rif, direccion, telefono, email, tipomoneda, mostrartotal ";
        const from = " from t_empresas ";
        const where = " where id = $1 ";
        const resp = await pool.query(sql + from + where, [id]);
        const data = {
            success: true,
            resp: resp.rows[0]
        };
        return res.status(200).json(data);
    }
    catch (e) {
        return res.status(400).send('Error Consultando Configuración >>>> ' + e);
    }
}
export async function getNumeroInterno (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idempresa } = req.params;
        const sql = "select max (numerointerno) as numerointerno ";
        const from = " from t_ventas ";
        const where = " where idempresa = $1 ";
        const resp = await pool.query(sql + from + where, [idempresa]);
        const data = {
            success: true,
            resp: resp.rows[0]
        };
        return res.status(200).json(data);
    }
    catch (e) {
        return res.status(400).send('Error Consultando Configuración >>>> ' + e);
    }
}
export async function updConfiguracion (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req.params;
        const { tasabcv, tipomoneda, mostrartotal, actualizar } = req.body;
        
        if(tasabcv > 0 && actualizar === 1) {
            console.log('Actualizando Inventario... ')
            const sql = "update t_productos set costo = costousd * $2, precio = preciousd * $2 ";
            const where = " where idcategoria in (select id from t_categorias where idempresa = $1 )";
            await pool.query(sql + where, [id, tasabcv]);
        }
        if(tasabcv > 0) {
            console.log('Actualizando Tasa BCV... ')
            const upd2 = "update t_empresas set tasabcv = $1 where id = $2 ";
            await pool.query(upd2, [tasabcv, id]);
        }
        
        if(tipomoneda && mostrartotal) {
            console.log('Actualizando tipomoneda y mostrartotal... ')
            let upd = "update t_empresas set tipomoneda = $1, mostrartotal = $2 where id = $3 ";
            await pool.query(upd, [tipomoneda, mostrartotal, id]);
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
}