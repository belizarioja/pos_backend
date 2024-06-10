import { Router } from 'express';
import { getProductos, setProducto, updateProductos, setProductoCompuesto, getProductosCompuesto, updateCompuesto, updateInventario } from '../controllers/productos.controller';

const router = Router();

router.route('/:idempresa/:idcategoria').get(getProductos)
router.route('/getcompuesto').post(getProductosCompuesto)
router.route('/').post(setProducto)
router.route('/updateproductos').post(updateProductos)
router.route('/updateinventario').post(updateInventario)
router.route('/updatecompuesto').post(updateCompuesto)
router.route('/compuesto').post(setProductoCompuesto)
        
export default router;