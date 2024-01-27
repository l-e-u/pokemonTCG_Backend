import { Router } from 'express';
import {
   // createCard,
   getCards,
   getCardById
} from '../controllers/controller.card.js';

const router = Router();

// GET all cards
router.get('/', getCards);

// GET one card
router.get('/:id', getCardById);

// POST a new card
// router.post('/', createCard);

export default router;