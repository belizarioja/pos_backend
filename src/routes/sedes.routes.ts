import { Router } from 'express';
import { getEmpresas } from '../controllers/sedes.controller';

const router = Router();

router.route('/').get(getEmpresas)
        
export default router;