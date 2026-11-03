import { Router } from 'express';
import * as controller from '../controllers/vendas.controller.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.patch('/:id/cancelar', controller.cancelar);

export default router;