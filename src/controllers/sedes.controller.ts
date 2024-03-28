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