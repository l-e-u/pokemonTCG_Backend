import Image from '../models/model.image.js';
import Pokemon from '../models/model.pokemon.js';

// Creates an image document
const createImage = async (req, res, next) => {
   try {
      const image = await Image.create({ ...req.body })

      return res.status(200).json(image);
   }
   catch (error) { next(error) }
};

// Gets images based on query
const getImages = async (req, res, next) => {
   try {
      const query = {};

      if (req.query.pokedexNumber) {
         query.file = { $regex: `_${req.query.pokedexNumber.toString().padStart(4, "0")}_`, $options: 'i' }
      };

      if (req.query.perspective) {
         query.file = { $regex: `_${req.query.perspective}_`, $options: "i" };
      };

      if (req.query.gender) {
         query.file = { $regex: `_${req.query.gender}_`, $options: "i" };
      }

      const images = await Image.find({ ...query });

      images.forEach(i => {
         console.log({
            file: i.file,
            details: i.details
         })
      })

      // for (let index = 0; index < images.length; index++) {
      //    const image = images[index]
      //    console.log(image._id.toString())
      //    const deleted = await Image.findByIdAndDelete(image._id.toString());
      //    console.log(deleted)
      // }

      return res.status(200).json(images)
   }
   catch (error) { next(error) }
};

// this is to pair images with coresponding pokemon, to be deleted after the database has been updated
const linkImagesWithPokemon = async (req, res, next) => {
   try {
      for (let nationalPokedexNumber = 1; nationalPokedexNumber < 152; nationalPokedexNumber++) {
         // get pokemon by pokedex number, this can include variants like female, mega, gigantamax, and regional versions
         const pokemons = await Pokemon.find({ nationalPokedexNumber });
         // get all images associated with pokemon
         const images = await Image.find({ file: { $regex: `_${nationalPokedexNumber.toString().padStart(4, "0")}_`, $options: 'i' } });

         // all images come in pairs as normal & shiny (rare) images
         const normalImages = images.filter(i => i.file.charAt(i.file.length - 1) === 'n');
         const rareImages = images.filter(i => i.file.charAt(i.file.length - 1) === 'r');

         // GIGANTAMAX
         // get this variant out the day since it's the easiest to identify
         const gIndex = pokemons.findIndex(p => p.name.includes('Gigantamax'));

         if (gIndex !== -1) {
            // get the pokemon and remove it from the array of pokemons
            const pokemon = pokemons.splice(gIndex, 1)[0];

            // find the normal and shiny images within their arrays
            const imageN_Image = normalImages.findIndex(n => n.details.gigantamax);
            const imageR_Image = rareImages.findIndex(r => r.details.gigantamax);

            // get the normal and shiny images and remove them from their arrays
            const normalImage = normalImages.splice(imageN_Image, 1)[0];
            const rareImage = rareImages.splice(imageR_Image, 1)[0];

            pokemon.images.normal = normalImage._id;
            pokemon.images.shiny = rareImage._id;

            console.log(pokemons)
            console.log(normalImages)
            console.log(rareImages)

            break;
            await pokemon.save();
         };

         // primary vairant

         // other variants
      };

      return res.status(200).json('done');
   }
   catch (error) { next(error) }
}

export {
   createImage,
   getImages,
   linkImagesWithPokemon
};