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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const multer = require("multer");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const sedes_routes_1 = __importDefault(require("./routes/sedes.routes"));
const categorias_routes_1 = __importDefault(require("./routes/categorias.routes"));
const clientes_routes_1 = __importDefault(require("./routes/clientes.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const impuestos_routes_1 = __importDefault(require("./routes/impuestos.routes"));
const unidades_routes_1 = __importDefault(require("./routes/unidades.routes"));
const tipodocumentos_routes_1 = __importDefault(require("./routes/tipodocumentos.routes"));
class App {
    constructor(
    // aqui variables y constantes
    ) {
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set('port', process.env.PORT);
        this.app.set('server', process.env.SERVIDOR);
        //this.app.set('server', process.env.SERVER || '/api_impredigital');
    }
    middlewares() {
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: '*'
        }));
    }
    routes() {
        this.app.use(this.app.get('server'), index_routes_1.default);
        this.app.use(this.app.get('server') + '/usuario', usuarios_routes_1.default);
        this.app.use(this.app.get('server') + '/categoria', categorias_routes_1.default);
        this.app.use(this.app.get('server') + '/clientes', clientes_routes_1.default);
        this.app.use(this.app.get('server') + '/productos', productos_routes_1.default);
        this.app.use(this.app.get('server') + '/impuestos', impuestos_routes_1.default);
        this.app.use(this.app.get('server') + '/unidades', unidades_routes_1.default);
        this.app.use(this.app.get('server') + '/sede', sedes_routes_1.default);
        this.app.use(this.app.get('server') + '/tipodocumento', tipodocumentos_routes_1.default);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.app.get('port'));
            console.log('Servidor en puerto ', this.app.get('port'));
            console.log('Servidor en carpeta ', this.app.get('server'));
        });
    }
}
exports.App = App;
