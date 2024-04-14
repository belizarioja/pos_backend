import { Router } from 'express';
import { getEmpresas, setEmpresa, updEmpresa, updateEstatusSede } from '../controllers/sedes.controller';

const router = Router();

router.route('/estatus/:id').put(updateEstatusSede)
router.route('/').get(getEmpresas)
router.route('/').post(setEmpresa)
router.route('/').put(updEmpresa)
        
export default router;