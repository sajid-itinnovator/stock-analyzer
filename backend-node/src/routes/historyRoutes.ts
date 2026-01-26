import { Router } from 'express';
import { getHistory, createHistoryRecord } from '../controllers/historyController';

const router = Router();

router.get('/', getHistory);
router.post('/', createHistoryRecord);

export default router;
