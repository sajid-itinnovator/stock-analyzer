import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';

const router = Router();

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
