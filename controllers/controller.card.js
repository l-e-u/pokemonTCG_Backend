import Card from '../models/model.card.js';

// utilities
import {
   getCardsByExpansionId,
   copyCardToMySchema,
} from '../utilities/utility.pokemonCardsAPI.js';

// GET all cards
const getCards = async (req, res, next) => {
   try {
      const { name, nationalPokedexNumber } = req.query;
      const cards = await Card.find({
         ...(name && { name }),
         ...(nationalPokedexNumber && { nationalPokedexNumber })
      })
         .populate({
            path: 'expansion',
            select: { 'cards': 0 }
         });

      return res.status(200).json(cards);
   }

   catch (error) { next(error) };
};

const getCardById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const card = await Card.findById(id)
         .populate({
            path: 'expansion',
            select: { 'cards': 0 }
         });

      return res.status(200).json(card);
   }

   catch (error) { next(error) }
};

// POST new cards based on the desired expansion
const createCardsByExpansion = async (req, res, next) => {
   const expansion = req.body;

   try {
      console.log(`WORKING: ${expansion.altId} - ${expansion.name}`);

      const data = await getCardsByExpansionId(expansion.altId);

      const newCards = data.map(copyCardToMySchema);

      await Card.insertMany(newCards)
         .then(async (cards) => {
            expansion.cards = [];

            cards.forEach(card => {
               expansion.cards.push(card._id);
            });

            await expansion.save();

            console.log('SUCCESS!', `${newCards.length} added!`);

         })
         .catch(error => {
            console.log(`ERROR @ ${index}`, error);
         });

      // New line
      console.log();

      return res.status(200).json("Complete");
   }

   catch (error) { next(error) }
};

export {
   createCardsByExpansion,
   getCards,
   getCardById,
};