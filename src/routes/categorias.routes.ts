import { Router } from 'express';
import { setCategoria, getCategorias } from '../controllers/categorias.controller';

const router = Router();

router.route('/:idempresa')
    .get(getCategorias)
    router.route('/')
        .post(setCategoria)
        
export default router;