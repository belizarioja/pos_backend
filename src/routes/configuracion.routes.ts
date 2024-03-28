import { Router } from 'express';
import { getConfiguracion, updConfiguracion } from '../controllers/configuracion.controller';

const router = Router();

router.route('/:id').get(getConfiguracion)
router.route('/:id').put(updConfiguracion)
    
export default router;