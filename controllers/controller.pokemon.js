import Pokemon from '../models/model.pokemon.js';

// GET all pokemon
const getAllPokemon = async (req, res, next) => {
   try {
      const query = req.query || {};
      const { name, nationalPokedexNumber } = query;

      const pokemon =
         await Pokemon
            .find({
               ...query,
               ...(name && {
                  name: {
                     $regex: name.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&"),
                     $options: 'i'
                  }
               }),
               ...(nationalPokedexNumber && { nationalPokedexNumber })
            })
            .populate(['images.normal', 'images.shiny'])
            .sort({ nationalPokedexNumber: 1 });

      return res.status(200).json(pokemon);
   }

   catch (error) { next(error) }
};

// // GET one pokemon by name
// const getOnePokemonByName = async (req, res, next) => {
//    try {
//       const { name } = req.params;

//       const pokemon =
//          await Pokemon
//             .findOne({ name })
//             .collation({ locale: 'en', strength: 2 });

//       return res.status(200).json(pokemon);
//    }

//    catch (error) { next(error) }
// };

// // GET list of pokemon names
// const getPokemonByNameSearch = async (req, res, next) => {
//    try {
//       const { name } = req.params;

//       const nameList =
//          await Pokemon
//             .find({
//                name: {
//                   $regex: name.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&"),
//                   $options: 'i'
//                },
//                primary: true
//             })
//             .populate(['images.normal', 'images.shiny'])
//             .sort({ name: 1 });

//       return res.status(200).json(nameList);
//    }

//    catch (error) { next(error) }
// };

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
      const { generation, max, min } = req.query

      const pokemon =
         await Pokemon
            .find({ nationalPokedexNumber: { $gte: min, $lte: max } })
            .sort({ nationalPokedexNumber: 1 });

      for (let i = 0; i < pokemon.length; i++) {
         const monster = pokemon[i]
         monster.generation = generation;
         await monster.save()
      }

      return res.status(200).json(pokemon)

   }
   catch (error) { next(error) }
}

// DELETE one pokemon by id
const deletePokemon = async (req, res, next) => {
   try {
      const { id } = req.query;

      const pokemon = await Pokemon.findByIdAndDelete(id);

      return res.status(200).json(pokemon);
   }
   catch (error) { next(error) }
}

export {
   // createPokemon,
   deletePokemon,
   getAllPokemon,
   // getPokemonByNameSearch,
   // getOnePokemonByName,
   updatePokemon
};