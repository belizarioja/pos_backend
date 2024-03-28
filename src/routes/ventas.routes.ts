import { Router } from 'express';
import { setHolds, setItemHolds, updItemHolds, getHolds, getItemsHolds, deleteItemHolds, deleteHolds, setVenta, getVentas, getItemsVentas, getVenta } from '../controllers/ventas.controller';

const router = Router();

router.route('/setholds').post(setHolds)
router.route('/setventa').post(setVenta)
router.route('/setitemholds').post(setItemHolds)
router.route('/upditemholds').post(updItemHolds)
router.route('/deleteitemholds').post(deleteItemHolds)
router.route('/deleteholds/:idhold').delete(deleteHolds)
router.route('/gethols/:idusuario').get(getHolds)
router.route('/getventas/:idempresa').get(getVentas)
router.route('/getventa/:idventa').get(getVenta)
router.route('/getitemshols/:idholds').get(getItemsHolds)
router.route('/getitemsventas/:idventa').get(getItemsVentas)
        
export default router;