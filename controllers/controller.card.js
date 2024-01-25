import Card from '../models/model.card.js';

// utilities
import {
   getCardsByName,
   getCardsByNationalPokedexNumber
} from '../utilities/utility.pokemonCardsAPI.js';

// GET all cards
const getCards = async (req, res, next) => {
   try {
      const { name, nationalPokedexNumber } = req.query;
      let cards;

      if (name) cards = await getCardsByName(name);

      if (nationalPokedexNumber) cards = await getCardsByNationalPokedexNumber(nationalPokedexNumber);

      return res.status(200).json(cards);
   }

   catch (error) { next(error) };
};

// POST new card
const createCard = async (req, res, next) => {
   try {
      const cards = await getCardsByNationalPokedexNumber(697);
      console.log('result:', cards)

      for (let index = 0; index < cards.length; index++) {
         const card = cards[index];
         console.log(card);
      }
      // const card = await Card.create({ ...req.body });

      return res.status(200).json(cards);
   }

   catch (error) { next(error) }
};

export {
   createCard,
   getCards
};