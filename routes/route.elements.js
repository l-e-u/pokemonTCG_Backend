import { Router } from 'express';
import {
   createElement,
   getElement,
   getElements
} from '../controllers/controller.element.js';

const router = Router();

// GET all elements
router.get('/', getElements);

// GET one element
router.get('/:type', getElement);

// POST a new element
router.post('/', createElement);

export default router;