import { Router } from 'express';
import {
   // createCard,
   syncCards,
   getCards,
   getCardById,
   linkCards
} from '../controllers/controller.card.js';

const router = Router();

// Temp to link pokemon cards from tcg api and my database
router.get('/link', linkCards);

// GET all cards
router.get('/', getCards);

// GET one card
router.get('/:id', getCardById);

router.patch('/sync', syncCards)
// POST a new card
// router.post('/', createCard);

export default router;