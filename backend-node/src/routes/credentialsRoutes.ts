import { Router } from 'express';
import { getCredentials, updateCredentials, getActiveApiKey } from '../controllers/credentialsController';

const router = Router();

router.get('/', getCredentials);
router.put('/', updateCredentials);
router.get('/active-key', getActiveApiKey);

export default router;
