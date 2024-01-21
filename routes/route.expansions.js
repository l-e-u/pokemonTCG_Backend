import { Router } from 'express';
import {
   createExpansion,
   getExpansion,
   getExpansions,
} from '../controllers/controller.expansion.js';

const router = Router();

// GET all expansions
router.get('/', getExpansions);

// GET one expansion
router.get('/', getExpansion);

// POST a new expansion
router.get('/', createExpansion);

export default router;