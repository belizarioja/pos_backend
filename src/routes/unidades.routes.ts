import { Router } from 'express';
import { getUnidades } from '../controllers/unidades.controller';

const router = Router();

router.route('/')
    .get(getUnidades)
    
export default router;