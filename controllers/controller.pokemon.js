import Pokemon from '../models/model.pokemon.js';

// GET all pokemon
const getAllPokemon = async (req, res, next) => {
   try {
      const pokemon =
         await Pokemon
            .find({})
            .sort({ pokedexNumber: 1 })
            .populate('elements');

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

// GET one pokemon by name
const getOnePokemonByName = async (req, res, next) => {
   const { name } = req.params;

   try {
      const pokemon =
         await Pokemon
            .findOne({ name })
            .collation({ locale: 'en', strength: 2 });

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

// GET list of pokemon names
const getListOfPokemonNames = async (req, res, next) => {
   const { name } = req.params;

   try {
      const nameList =
         await Pokemon
            .find({ name: { $regex: name, $options: 'i' }, primary: true })
            .sort({ name: 1 });

      return res.status(200).json(nameList);
   }

   catch (error) { next(error) }
};

// POST new pokemon
// const createPokemon = async (req, res, next) => {
//    try {
//       const pokemon = await Pokemon.create({ ...req.body });

//       return res.status(200).json(pokemon);
//    }

//    catch (error) { next(error) }
// };

const updatePokemon = async (req, res, next) => {
   try {
      const pokemon =
         await Pokemon
            .find({})
            .sort({ nationalPokedexNumber: 1 });

      for (let index = 0; index < 1025; index++) {
         const natNum = index + 1;

         const batch =
            pokemon
               .filter(({ nationalPokedexNumber }) => nationalPokedexNumber === natNum).
               sort((a, b) => a.name.length - b.name.length);

         const primary = batch.shift()

         primary.primary = true;
         await primary.save()
      }

      return res.status(200).json('done')

   }
   catch (error) { next(error) }
}

export {
   // createPokemon,
   getAllPokemon,
   getListOfPokemonNames,
   getOnePokemonByName,
   // updatePokemon
};