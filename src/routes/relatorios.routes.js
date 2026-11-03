import { Router } from 'express';
import * as controller from '../controllers/relatorios.controller.js';

const router = Router();

router.get('/vendas', controller.vendas);

export default router;