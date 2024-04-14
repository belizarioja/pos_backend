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

export async function setEmpresa (req: Request, res: Response): Promise<Response | void> {
    try {
        const { tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion } = req.body;

        const insert = "insert into t_empresas (tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion, estatus ) ";
        const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, 1) ";
        await pool.query(insert + values, [tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion]);
        const data = {
            success: true,
            resp: {
                message: "Cliente Emisor CREADO con éxito"
            }
        };
        return res.status(200).json(data);      
    }
    catch (e) {
        return res.status(400).send('Error Creando Cliente Emisor ' + e);
    }
}

export async function updEmpresa (req: Request, res: Response): Promise<Response | void> {
    try {
        const { id } = req.params;
        const { tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion } = req.body;
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
        if(tokenfacturacion.length > 0)
        {
            upd += ", tokenfacturacion = '" + tokenfacturacion + "'"
        }
        if(urlfacturacion.length > 0)
        {
            upd += ", urlfacturacion = '" + urlfacturacion + "'"
        }
        const where = " where id = $2 ";
        const resp = await pool.query(upd + where, [tasabcv, id]);
        const data = {
            success: true,
            resp: 'Cliemte Emisor editado con éxito'
        };
        return res.status(200).json(data);
    }
    catch (e) {
        return res.status(400).send('Error Editando Empresa >>>> ' + e);
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