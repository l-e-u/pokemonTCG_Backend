import { Router } from 'express';
import {
   createCard,
   getCards
} from '../controllers/controller.card.js';

const router = Router();

// GET all cards
router.get('/', getCards);

// POST a new card
router.post('/', createCard);

export default router;