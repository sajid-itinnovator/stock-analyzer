import { Router } from 'express';
import { proxyChat } from '../controllers/chatController';

const router = Router();

router.post('/', proxyChat);

export default router;
