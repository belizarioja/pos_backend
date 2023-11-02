import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
// const multer = require("multer");

import IndexRoutes from './routes/index.routes'
import UsuarioRoutes from './routes/usuarios.routes'
import SedesRoutes from './routes/sedes.routes'
import CategoriasRoutes from './routes/categorias.routes'
import ClientesRoutes from './routes/clientes.routes'
import ProductosRoutes from './routes/productos.routes'
import ImpuestosRoutes from './routes/impuestos.routes'
import UnidadesRoutes from './routes/unidades.routes'
import TipoDocumentosRoutes from './routes/tipodocumentos.routes'

export class App {
    app: Application;

    constructor(
        // aqui variables y constantes
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
        
    }

    private settings () {
        this.app.set('port', process.env.PORT);
        this.app.set('server', process.env.SERVIDOR);
        //this.app.set('server', process.env.SERVER || '/api_impredigital');
    }
    private middlewares () {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(cors({
            origin: '*'
        }));
    }

    private routes () {
        this.app.use(this.app.get('server'), IndexRoutes);
        this.app.use(this.app.get('server') + '/usuario', UsuarioRoutes);
        this.app.use(this.app.get('server') + '/categoria', CategoriasRoutes);
        this.app.use(this.app.get('server') + '/clientes', ClientesRoutes);
        this.app.use(this.app.get('server') + '/productos', ProductosRoutes);
        this.app.use(this.app.get('server') + '/impuestos', ImpuestosRoutes);
        this.app.use(this.app.get('server') + '/unidades', UnidadesRoutes);
        this.app.use(this.app.get('server') + '/sede', SedesRoutes);
        this.app.use(this.app.get('server') + '/tipodocumento', TipoDocumentosRoutes);

    }

    async listen () {
        await this.app.listen(this.app.get('port'));
        console.log('Servidor en puerto ', this.app.get('port'));
        console.log('Servidor en carpeta ', this.app.get('server'));
    }

}