"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventas_controller_1 = require("../controllers/ventas.controller");
const router = (0, express_1.Router)();
router.route('/setholds').post(ventas_controller_1.setHolds);
router.route('/setventa').post(ventas_controller_1.setVenta);
router.route('/setitemholds').post(ventas_controller_1.setItemHolds);
router.route('/upditemholds').post(ventas_controller_1.updItemHolds);
router.route('/updcomentarioitemholds').post(ventas_controller_1.updComentarioItemHolds);
router.route('/updprecioitemholds').post(ventas_controller_1.updPrecioItemHolds);
router.route('/deleteitemholds').post(ventas_controller_1.deleteItemHolds);
router.route('/deleteholds').post(ventas_controller_1.deleteHolds);
router.route('/gethols/:idusuario').get(ventas_controller_1.getHolds);
router.route('/getventas').post(ventas_controller_1.getVentas);
router.route('/getventa/:idventa').get(ventas_controller_1.getVenta);
router.route('/getitemshols/:idholds').get(ventas_controller_1.getItemsHolds);
router.route('/getitemsventas/:idventa').get(ventas_controller_1.getItemsVentas);
router.route('/getventanumerointerno/:idempresa/:idtipofactura/:numerointerno').get(ventas_controller_1.getVentaNumeroInterno);
router.route('/anularventa').post(ventas_controller_1.anularVenta);
router.route('/updventa').post(ventas_controller_1.updVenta);
exports.default = router;
