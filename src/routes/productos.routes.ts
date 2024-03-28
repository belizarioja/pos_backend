import { Router } from 'express';
import { getProductos, setProductos, updateProductos } from '../controllers/productos.controller';

const router = Router();

router.route('/:idempresa/:idcategoria').get(getProductos)
router.route('/').post(setProductos)
router.route('/updateproductos').post(updateProductos)
        
export default router;