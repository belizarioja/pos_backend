import { Request, Response } from 'express';

// DB
import { pool } from '../database'

export async function getCategorias (req: Request, res: Response): Promise<Response | void> {
    try {
        const { idempresa } = req.params;
        console.log('idempresa')
        console.log(idempresa)
        const select = "select * from t_categorias ";
        const where = " where idempresa = $1";
        const resp = await pool.query(select + where, [idempresa]);
        console.log( resp.rows)
        const data = {
            success: true,
            resp: resp.rows
        };
        return res.status(200).json(data);  
        
    }
    catch (e) {
        return res.status(400).send('Error Creando categoria ' + e);
    }
}
export async function setCategoria (req: Request, res: Response): Promise<Response | void> {
    try {
        const { categoria, descripcion, idempresa } = req.body;
        console.log('idempresa')
        console.log(idempresa)
        const insert = "insert into t_categorias (categoria, descripcion, idempresa) ";
        const values = " values ($1, $2, $3)";
        await pool.query(insert + values, [categoria, descripcion, idempresa]);
        const data = {
            success: true,
            resp: {
                message: "Categoria creada con éxito"
            }
        };
        return res.status(200).json(data);
        
    }
    catch (e) {
        return res.status(400).send('Error Creando categoria ' + e);
    }
}