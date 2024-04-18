import { Router } from 'express';
import { getProductos, setProducto, updateProductos } from '../controllers/productos.controller';

const router = Router();

router.route('/:idempresa/:idcategoria').get(getProductos)
router.route('/').post(setProducto)
router.route('/updateproductos').post(updateProductos)
        
export default router;