import { Router } from 'express';
import * as controller from '../controllers/itensVenda.controller.js';

const router = Router();

router.get('/', controller.listar);

export default router;