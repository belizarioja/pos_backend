import { Router } from 'express';
import { getUsuarios, setUsuarios, getLogin, getRoles, updateEstatus, updateClave, updUsuario } from '../controllers/usuarios.controller';

const router = Router();

router.route('/').post(getUsuarios)
router.route('/crear').post(setUsuarios)
router.route('/:id').put(updUsuario)
router.route('/login').post(getLogin)
router.route('/roles').get(getRoles)
router.route('/estatus/:id').put(updateEstatus)
router.route('/cambioclave/:id').put(updateClave)
        
export default router;