import Card from '../models/model.card.js';

// GET all cards
const getCards = async (req, res, next) => {
   try {
      const cards = await Card.find({}).sort({ name: 1 });

      return res.status(200).json(cards);
   }

   catch (error) { next(error) };
};

// POST new card
const createCard = async (req, res, next) => {
   try {
      const card = await Card.create({ ...req.body });

      return res.status(200).json(card);
   }

   catch (error) { next(error) }
};

export {
   createCard,
   getCards
};