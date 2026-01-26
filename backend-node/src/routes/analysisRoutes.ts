import { Router } from 'express';
import { triggerAnalysis } from '../controllers/analysisController';

const router = Router();

router.post('/', triggerAnalysis);

export default router;
