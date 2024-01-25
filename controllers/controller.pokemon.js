import Pokemon from '../models/model.pokemon.js';

// GET all pokemon
const getAllPokemon = async (req, res, next) => {
   try {
      const pokemon = await Pokemon.find({}).sort({ pokedexNumber: 1 }).populate('elements');

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

// GET one pokemon by name
const getOnePokemonByName = async (req, res, next) => {
   const { name } = req.params;

   try {
      const pokemon = await Pokemon.findOne({ name })
         .collation({ locale: 'en', strength: 2 });

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

// POST new pokemon
const createPokemon = async (req, res, next) => {
   try {
      const pokemon = await Pokemon.create({ ...req.body });

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

export {
   createPokemon,
   getAllPokemon,
   getOnePokemonByName,
};