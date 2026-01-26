import { Router } from 'express';
import { getLatestNews } from '../controllers/newsController';

const router = Router();

router.get('/', getLatestNews);

export default router;
