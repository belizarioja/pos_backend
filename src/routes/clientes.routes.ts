import { Router } from 'express';
import { getClientes, setCliente } from '../controllers/clientes.controller';

const router = Router();

router.route('/buscar')
    .post(getClientes)
        
router.route('/crear')
.post(setCliente)
    
export default router;