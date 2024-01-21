import Pokemon from '../models/model.pokemon.js';

// GET all pokemon
const getAllPokemon = async (req, res, next) => {
   try {
      const pokemon = await Pokemon.find({}).sort({ pokedexNumber: 1 });

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

// GET one pokemon
const getOnePokemon = async (req, res, next) => {
   const { id } = req.params;

   try {
      const pokemon = await Pokemon.findOne({ id });

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

export {
   getAllPokemon,
   getOnePokemon,
};