import { Request, Response } from 'express';

import { pool } from '../database'

export async function getEmpresas (req: Request, res: Response): Promise<Response | void> {
    try {
        const sql = "select * from t_empresas";
        const resp = await pool.query(sql);        
        const data = {
            success: true,
            data: resp.rows
        };
        return res.status(200).json(data);        
    }
    catch (e) {
        return res.status(400).send('Error Listando Empresas ' + e);
    }
}

export async function updateEstatusSede (req: Request, res: Response): Promise<Response | void> {
    try {
        const { estatus } = req.body;
        const { id } = req.params;       

        const sqlupd = "update t_empresas set estatus = $1 where id = $2 ";
        await pool.query(sqlupd, [estatus, id])
        const data = {
            success: true,
            resp: {
                message: "Estatus de Cliente Emisor actualizado con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Actualizando Estatus de Cliente Emisor ' + e);
    }
}