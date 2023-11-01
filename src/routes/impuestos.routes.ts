import { Router } from 'express';
import { getImpuestos } from '../controllers/impuestos.controller';

const router = Router();

router.route('/')
    .get(getImpuestos)
    
export default router;