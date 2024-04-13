import { Router } from 'express';
import { getEmpresas, updateEstatusSede } from '../controllers/sedes.controller';

const router = Router();

router.route('/estatus/:id').put(updateEstatusSede)
router.route('/').get(getEmpresas)
        
export default router;