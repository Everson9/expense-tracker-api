import { Router } from 'express';
import { getAll, upsert, remove } from '../controllers/budgetController';

const router = Router();

router.get('/', getAll);
router.put('/:category', upsert);
router.delete('/:category', remove);

export default router;
