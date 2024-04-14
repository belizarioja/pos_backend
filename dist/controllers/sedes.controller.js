"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstatusSede = exports.updEmpresa = exports.setEmpresa = exports.getEmpresas = void 0;
const database_1 = require("../database");
function getEmpresas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select * from t_empresas";
            const resp = yield database_1.pool.query(sql);
            const data = {
                success: true,
                data: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Empresas ' + e);
        }
    });
}
exports.getEmpresas = getEmpresas;
function setEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion } = req.body;
            const insert = "insert into t_empresas (tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion, estatus ) ";
            const values = " values ($1, $2, $3, $4, $5, $6, $7, $8, 1) ";
            yield database_1.pool.query(insert + values, [tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion]);
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
    });
}
exports.setEmpresa = setEmpresa;
function updEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { tasabcv, rif, empresa, direccion, email, telefono, tokenfacturacion, urlfacturacion } = req.body;
            let upd = "update t_empresas set tasabcv = $1 ";
            if (rif.length > 0) {
                upd += ", rif = '" + rif + "'";
            }
            if (empresa.length > 0) {
                upd += ", empresa = '" + empresa + "'";
            }
            if (direccion.length > 0) {
                upd += ", direccion = '" + direccion + "'";
            }
            if (email.length > 0) {
                upd += ", email = '" + email + "'";
            }
            if (telefono.length > 0) {
                upd += ", telefono = '" + telefono + "'";
            }
            if (tokenfacturacion.length > 0) {
                upd += ", tokenfacturacion = '" + tokenfacturacion + "'";
            }
            if (urlfacturacion.length > 0) {
                upd += ", urlfacturacion = '" + urlfacturacion + "'";
            }
            const where = " where id = $2 ";
            const resp = yield database_1.pool.query(upd + where, [tasabcv, id]);
            const data = {
                success: true,
                resp: 'Cliemte Emisor editado con éxito'
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Editando Empresa >>>> ' + e);
        }
    });
}
exports.updEmpresa = updEmpresa;
function updateEstatusSede(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { estatus } = req.body;
            const { id } = req.params;
            const sqlupd = "update t_empresas set estatus = $1 where id = $2 ";
            yield database_1.pool.query(sqlupd, [estatus, id]);
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
    });
}
exports.updateEstatusSede = updateEstatusSede;
