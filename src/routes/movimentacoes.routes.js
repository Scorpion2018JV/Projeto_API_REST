import { Router } from 'express';
import * as controller from '../controllers/movimentacoes.controller.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/entrada', controller.registrarEntrada);

export default router;