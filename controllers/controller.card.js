import Card from '../models/model.card.js';
import Expansion from '../models/model.expansion.js';
import Series from '../models/model.series.js';

// utilities
import {
   getAllSets,
   getCardsByExpansionId,
   copyCardToMySchema,
   getCardsByNationalPokedexNumber
} from '../utilities/utility.pokemonCardsAPI.js';

// GET all cards
const getCards = async (req, res, next) => {
   try {
      const { name, nationalPokedexNumber } = req.query;
      const cards =
         await Card
            .find({
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

const linkCards = async (req, res, next) => {
   const { nationalPokedexNumber } = req.query;

   try {
      const theirCards = await getCardsByNationalPokedexNumber(nationalPokedexNumber);

      for (let index = 0; index < theirCards.length; index++) {
         const theirCard = theirCards[index];

         const myCard = await Card.findOne({ altId: theirCard.id });

         if (!myCard) {
            console.log("NOT FOUND!");
            console.log(theirCard);

            continue;
         };

         myCard.nationalPokedexNumbers = theirCard.nationalPokedexNumbers;
         await myCard.save();
      };

      return res.status(200).json("cards linked");
   }
   catch (error) { next(error) }
};

const syncCards = async (req, res, next) => {
   try {
      const newExpansions = [];

      // get the expansions (sets) from their database
      const theirExpansions = await getAllSets();

      // get my expansions to compare with theirs
      const myExpansions = await Expansion.find().sort({ altId: 1 });

      // both are sorted
      theirExpansions.sort((a, b) => a.id.localeCompare(b.id));

      // loop through both, comparing expansions
      for (let index = 0; index < theirExpansions.length; index++) {
         const theirExpansion = theirExpansions[index];
         const myExpansion = myExpansions[index - newExpansions.length];

         // new expansions are stored
         if (theirExpansion.id !== myExpansion?.altId) {
            newExpansions.push(theirExpansion)
         };
      };

      for (let index = 0; index < newExpansions.length; index++) {
         const newExpansion = newExpansions[index];
         const expansion = await Expansion.create({
            abbreviation: newExpansion.ptcgoCode,
            altId: newExpansion.id,
            name: newExpansion.name,
            released: new Date(newExpansion.releaseDate),
            count: {
               printed: newExpansion.printedTotal,
               total: newExpansion.total
            },
            images: {
               logoURL: newExpansion.images.logo,
               symbolURL: newExpansion.images.symbol
            }
         });

         await Series.findOneAndUpdate(
            { name: expansion.series },
            { $push: { expansions: expansion } },
            { upsert: true }
         );

         const series = await Series.findOne()
      };


      return res.status(200).json(newExpansions.length > 0 ? newExpansions : 'Synced')
   }
   catch (error) { next(error) }
};

export {
   syncCards,
   createCardsByExpansion,
   getCards,
   getCardById,
   linkCards
};