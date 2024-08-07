import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getImpuestos (req: Request, res: Response): Promise<Response | void> {
    try {
        const select = "select * from t_impuestos ";
        const resp = await pool.query(select);
        // console.log( resp.rows)
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);  
        
    }
    catch (e) {
        return res.status(400).send('Error Listando impuestos ' + e);
    }
}