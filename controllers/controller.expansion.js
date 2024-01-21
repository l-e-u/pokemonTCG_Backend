import Expansion from '../models/model.expansion.js'

// GET all expansions
const getExpansions = async (req, res, next) => {
   try {
      const expansions = await Expansion.find({}).sort({ name: 1 });

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
const createExpansion = async (req, res, next) => {
   try {
      const expansion = await Expansion.create({ ...req.body });

      return res.status(200).json(expansion);
   }

   catch (error) { next(error) }
};

export {
   createExpansion,
   getExpansion,
   getExpansions,
};