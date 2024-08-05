import { Router } from 'express';
import { setHolds, setItemHolds, updItemHolds, getHolds, getItemsHolds, deleteItemHolds, deleteHolds, setVenta, getVentas, getItemsVentas, getVenta, getVentaNumeroInterno, anularVenta, updComentarioItemHolds, updPrecioItemHolds, updVenta, setNotaCredito } from '../controllers/ventas.controller';

const router = Router();

router.route('/setholds').post(setHolds)
router.route('/setventa').post(setVenta)
router.route('/setitemholds').post(setItemHolds)
router.route('/upditemholds').post(updItemHolds)
router.route('/updcomentarioitemholds').post(updComentarioItemHolds)
router.route('/updprecioitemholds').post(updPrecioItemHolds)
router.route('/deleteitemholds').post(deleteItemHolds)
router.route('/deleteholds').post(deleteHolds)
router.route('/gethols/:idusuario').get(getHolds)
router.route('/getventas').post(getVentas)
router.route('/getventa/:idventa').get(getVenta)
router.route('/getitemshols/:idholds').get(getItemsHolds)
router.route('/getitemsventas/:idventa').get(getItemsVentas)
router.route('/getventanumerointerno/:idempresa/:idtipofactura/:numerointerno').get(getVentaNumeroInterno)
router.route('/anularventa').post(anularVenta)
router.route('/updventa').post(updVenta)
router.route('/setnotacredito').post(setNotaCredito)
        
export default router;