import { Router } from 'express';
import { getProductos, setProductos } from '../controllers/productos.controller';

const router = Router();

router.route('/:idempresa/:idcategoria')
    .get(getProductos)
    router.route('/')
        .post(setProductos)
        
export default router;