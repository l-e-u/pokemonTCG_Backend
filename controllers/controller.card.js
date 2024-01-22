import Card from '../models/model.card.js';

// utilities
import { getCardsByPokemonName } from '../utilities/utility.pokemonCardsAPI.js';

// GET all cards
const getCards = async (req, res, next) => {
   const { data: cards } = await getCardsByPokemonName('mew');

   console.log(cards);

   return res.status(200).json(cards);


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