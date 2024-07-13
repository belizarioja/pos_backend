import { Router } from 'express';
import { getConfiguracion, getNumeroInterno, updConfiguracion } from '../controllers/configuracion.controller';

const router = Router();

router.route('/:id').get(getConfiguracion)
router.route('/getnumerointerno/:idempresa').get(getNumeroInterno)
router.route('/:id').put(updConfiguracion)
    
export default router;