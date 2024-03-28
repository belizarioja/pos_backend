import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getConfiguracion (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req.params;
        const sql = "select id, tasabcv, urlfacturacion, tokenfacturacion, empresa, rif, direccion, telefono, email ";
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
export async function updConfiguracion (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req.params;
        const { tasabcv, rif, empresa, direccion, email, telefono } = req.body;
        let upd = "update t_empresas set tasabcv = $1 ";
        
        if(rif.length > 0)
        {
            upd += ", rif = '" + rif + "'"
        }
        if(empresa.length > 0)
        {
            upd += ", empresa = '" + empresa + "'"
        }
        if(direccion.length > 0)
        {
            upd += ", direccion = '" + direccion + "'"
        }
        if(email.length > 0)
        {
            upd += ", email = '" + email + "'"
        }
        if(telefono.length > 0)
        {
            upd += ", telefono = '" + telefono + "'"
        }
        const where = " where id = $2 ";
        const resp = await pool.query(upd + where, [tasabcv, id]);
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