import { Router } from 'express';
import * as controller from '../controllers/estoque.controller.js';

const router = Router();

router.get('/', controller.listar);
router.get('/baixo', controller.baixo);

export default router;