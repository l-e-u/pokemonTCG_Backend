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
      const { name, nationalPokedexNumbers } = req.query;

      const cards =
         await Card
            .find({
               ...(name && { name }),
               ...(nationalPokedexNumbers && { nationalPokedexNumbers })
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
   // const { nationalPokedexNumber } = req.query;

   try {
      for (let nationalPokedexNumber = 17; nationalPokedexNumber <= 1025; nationalPokedexNumber++) {
         console.log("Pokemon Number:", nationalPokedexNumber);

         const theirCards = await getCardsByNationalPokedexNumber(nationalPokedexNumber);

         // return res.status(200).json(theirCards.map(card => ({ id: card.id, name: card.name, set: card.set.id })))

         let count = 8
         const id = setInterval(() => {
            if (count > 10) count = 8;
            console.log('syncing'.padStart(count, '.'));
            count++;
         }, 1000);

         for (let index = 0; index < theirCards.length; index++) {
            const theirCard = theirCards[index];

            const myCard = await Card.findOneAndUpdate(
               { altId: theirCard.id },
               { nationalPokedexNumbers: theirCard.nationalPokedexNumbers },
               { new: true }
            );

            if (!myCard) {
               const expansion = await Expansion.findOne({ altId: theirCard.set.id });

               if (!expansion) {
                  console.log("NOT FOUND!");
                  console.log(theirCard);

                  throw "no expansion"
               };

               const cardCopy = copyCardToMySchema(theirCard);

               cardCopy.expansion = expansion._id;

               const card = await Card.create(cardCopy);

               console.log('NEW CARD ADDED!');
               console.log(card);
            };
         };

         clearInterval(id);
         console.log(`${theirCards.length} cards synced!`);
      };

      return res.status(200).json('complete');
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

      // with each new expansion on their database. create and copy the expansion and its cards to my database
      for (let index = 0; index < newExpansions.length; index++) {
         const newExpansion = newExpansions[index];

         // create the new expansion on my database
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

         console.log(`WORKING: ${expansion.altId} - ${expansion.name}`);

         // get all the cards in the new expansion from their database
         const data = await getCardsByExpansionId(expansion.altId);

         // copy their cards using the schema on my database
         const newCards = data.map(copyCardToMySchema);

         // add the expansion id to each card
         newCards.forEach(card => {
            card.expansion = _id;
         });

         // add all the cards to the database
         await Card.insertMany(newCards)
            .then(async (cards) => {
               expansion.cards = [];

               cards.forEach(card => {
                  expansion.cards.push(card._id);
               });

               await expansion.save();

               // update the series or create a new one
               await Series.findOneAndUpdate(
                  { name: newExpansion.series },
                  { $push: { expansions: expansion } },
                  { upsert: true }
               );

               console.log('SUCCESS!', `${newCards.length} added!`);

            })
            .catch(async (error) => {
               // any errors will delete the expansion off of my database
               await expansion.deleteOne();
               console.log(`ERROR @ ${index}`, error);
            });
      };

      return res.status(200).json(newExpansions.length > 0 ? newExpansions : 'Synced');
   }
   catch (error) { next(error) }
};

export {
   // syncCards,
   // createCardsByExpansion,
   getCards,
   // getCardById,
   // linkCards
};