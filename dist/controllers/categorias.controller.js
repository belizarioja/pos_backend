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
exports.setCategoria = exports.getCategorias = void 0;
// DB
const database_1 = require("../database");
function getCategorias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idempresa } = req.params;
            console.log('idempresa');
            console.log(idempresa);
            const select = "select * from t_categorias ";
            const where = " where idempresa = $1";
            const resp = yield database_1.pool.query(select + where, [idempresa]);
            console.log(resp.rows);
            const data = {
                success: true,
                resp: resp.rows
            };
            return res.status(200).json(data);
        }
        catch (e) {
            return res.status(400).send('Error Creando categoria ' + e);
        }
    });
}
exports.getCategorias = getCategorias;
function setCategoria(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoria, descripcion, idempresa } = req.body;
            console.log('idempresa');
            console.log(idempresa);
            const insert = "insert into t_categorias (categoria, descripcion, idempresa) ";
            const values = " values ($1, $2, $3)";
            yield database_1.pool.query(insert + values, [categoria, descripcion, idempresa]);
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
    });
}
exports.setCategoria = setCategoria;
