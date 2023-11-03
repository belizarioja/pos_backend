import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getClientes (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idtipodocumento, documento } = req.body;
   
        const select = "select * from t_clientes ";
        const where = " where idtipodocumento = $1 and documento = $2";
        const resp = await pool.query(select + where, [idtipodocumento, documento]);
     
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);  
        
    }
    catch (e) {
        return res.status(400).send('Error Buscando cliente ' + e);
    }
}

export async function setCliente (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idtipodocumento, documento, nombre, correo, telefono, direccion } = req.body;
  
        const insert = "insert into t_clientes (idtipodocumento, documento, nombre, correo, telefono, direccion) ";
        const values = " values ($1, $2, $3, $4, $5, $6) RETURNING id";
        const resp = await pool.query(insert + values, [idtipodocumento, documento, nombre, correo, telefono, direccion ]);
        const data = {
            success: true,
            resp: resp.rows[0].id
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Creando cliente ' + e);
    }
}