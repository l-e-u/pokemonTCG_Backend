import Expansion from '../models/model.expansion.js';
// import Series from '../models/model.series.js';

// GET all expansions
const getExpansions = async (req, res, next) => {
   try {
      const expansions = await Expansion.find({}).sort({ release: 1 });

      return res.status(200).json(expansions);
   }

   catch (error) { next(error) };
};

// GET one expansion
const getExpansion = async (req, res, next) => {
   const { name } = req.params;

   try {
      const expansion = await Expansion.findOne({ name });

      return res.status(200).json(expansion);
   }

   catch (error) { next(error) }
};

// POST new expansion
// const createExpansion = async (req, res, next) => {
//    try {

//       const series = [];

//       // these are their expansions
//       const sets = await getAllSets();

//       sets.forEach(async (set) => {
//          const myExpansion = {
//             abbreviation: set.ptcgoCode,
//             altId: set.id,
//             name: set.name,
//             released: new Date(set.releaseDate),
//             count: {
//                printed: set.printedTotal,
//                total: set.total
//             },
//             images: {
//                logoURL: set.images.logo,
//                symbolURL: set.images.symbol
//             }
//          };

//          const expansion = await Expansion.create(myExpansion);

//          await Series.findOneAndUpdate(
//             { name: set.series },
//             { $push: { expansions: expansion } },
//             { upsert: true }
//          );

//       });

//       return res.status(200).json(series);
//    }

//    catch (error) { next(error) }
// };

export {
   // createExpansion,
   getExpansion,
   getExpansions,
};