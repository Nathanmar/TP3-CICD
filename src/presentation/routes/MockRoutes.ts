import { Router } from 'express';
import { MockController } from '../controllers/MockController.js';

const router = Router();
const mockController = new MockController();

router.post('/mock', mockController.handleMockRequest);

export default router;
