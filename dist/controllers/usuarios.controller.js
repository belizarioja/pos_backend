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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClave = exports.updateEstatus = exports.updUsuario = exports.setUsuarios = exports.getRoles = exports.getUsuarios = exports.getLogin = void 0;
// import crypto from 'crypto';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET || '123456';
// DB
const database_1 = require("../database");
function getLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { usuario, clave } = req.body;
            const sql = "select a.id, a.idrol, a.idempresa, c.empresa, c.tasabcv, c.urlfacturacion, c.tokenfacturacion, a.nombre, b.rol, a.estatus, a.resetearclave ";
            const from = " from t_usuarios a ";
            let leftjoin = " left join t_roles b ON a.idrol = b.id  ";
            leftjoin += " left join t_empresas c ON a.idempresa = c.id  ";
            const where = " where a.usuario ='" + usuario + "' and a.clave = '" + clave + "'";
            // console.log(sql + from + leftjoin + where);
            const resp = yield database_1.pool.query(sql + from + leftjoin + where);
            // console.log(resp.rows[0])
            const cant = resp.rows.length;
            if (cant > 0) {
                if (resp.rows[0].estatus === '0') {
                    const data = {
                        message: "Usuario no autorizado!"
                    };
                    return res.status(202).json(data);
                }
                else {
                    const accessToken = jsonwebtoken_1.default.sign({ user: resp.rows[0] }, SECRET);
                    const data = {
                        message: "Acceso válido",
                        resp: resp.rows[0],
                        accessToken: accessToken
                    };
                    return res.status(200).json(data);
                }
            }
            else {
                const data = {
                    message: "Credenciales Incorrectas!"
                };
                return res.status(202).json(data);
            }
        }
        catch (e) {
            return res.status(400).send('Error Logueando ' + e);
        }
    });
}
exports.getLogin = getLogin;
function getUsuarios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select a.id, a.idrol, a.usuario, a.clave, a.email, a.idempresa, a.nombre, c.empresa, b.rol, a.estatus ";
            const from = " from t_usuarios a ";
            let leftjoin = " left join t_roles b ON a.idrol = b.id  ";
            leftjoin += " left join t_empresas c ON a.idempresa = c.id  ";
            const resp = yield database_1.pool.query(sql + from + leftjoin);
            const cant = resp.rows.length;
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Usuarios ' + e);
        }
    });
}
exports.getUsuarios = getUsuarios;
function getRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = "select * ";
            const from = " from t_roles ";
            const resp = yield database_1.pool.query(sql + from);
            const cant = resp.rows.length;
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Listando Roles ' + e);
        }
    });
}
exports.getRoles = getRoles;
function setUsuarios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nombre, usuario, clave, idrol, idempresa, email } = req.body;
            const insert = "insert into t_usuarios (nombre, usuario, clave, email, idrol, idempresa, estatus ) ";
            const values = " values ($1, $2, $3, $4, $5, $6, 1) ";
            yield database_1.pool.query(insert + values, [nombre, usuario, clave, email, idrol, idempresa]);
            const data = {
                success: true,
                resp: {
                    message: "Usuario creado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando Usuario ' + e);
        }
    });
}
exports.setUsuarios = setUsuarios;
function updUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nombre, clave, usuario, email } = req.body;
            const { id } = req.params;
            let sqlupd = "update t_usuarios set nombre = $1, usuario = $2, clave = $3 ";
            if (email.length > 0) {
                sqlupd += ", email = '" + email + "'";
            }
            const where = " where id = $4 ";
            let set = yield database_1.pool.query(sqlupd + where, [nombre, usuario, clave, id]);
            const data = {
                success: true,
                resp: {
                    message: "Usuario actualizado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Actualizando Estatus de Usuarios ' + e);
        }
    });
}
exports.updUsuario = updUsuario;
function updateEstatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { estatus } = req.body;
            const { id } = req.params;
            const sqlupd = "update t_usuarios set estatus = $1 where id = $2 ";
            yield database_1.pool.query(sqlupd, [estatus, id]);
            const data = {
                success: true,
                resp: {
                    message: "Estatus de Usuario actualizado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Actualizando Estatus de Usuarios ' + e);
        }
    });
}
exports.updateEstatus = updateEstatus;
function updateClave(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nuevaclave } = req.body;
            const { id } = req.params;
            const sqlupd = "update t_usuarios set clave = $1 where id = $2 ";
            yield database_1.pool.query(sqlupd, [nuevaclave, id]);
            const data = {
                success: true,
                resp: {
                    message: "Clave de Usuario actualizado con éxito"
                }
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Actualizando Clave de Usuarios ' + e);
        }
    });
}
exports.updateClave = updateClave;
