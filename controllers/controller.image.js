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

const linkImagesWithPokemon = async (req, res, next) => {
   try {
      for (let nationalPokedexNumber = 1; nationalPokedexNumber < 152; nationalPokedexNumber++) {
         const pokemons = await Pokemon.find({ nationalPokedexNumber }).exec();
         const images = await Image.find({ file: { $regex: `_${nationalPokedexNumber.toString().padStart(4, "0")}_`, $options: 'i' } });

         // GIGANTAMAX
         // only 1 variant: mf (male/female)
         const pokemonG = pokemons.find(poke => poke.name.includes("Gigantamax"));
         const imageG_Normal = images.find(img => img.details.gigantamax && !img.details.shiny);
         const imageG_Shiny = images.find(img => img.details.gigantamax && img.details.shiny);

         if (pokemonG) {
            pokemonG.images.normal = imageG_Normal._id;
            pokemonG.images.shiny = imageG_Shiny._id;
            await pokemonG.save();

            // console.log("_____ GIGANTAMAX _____");
            // console.log("POKEMON:", pokemonG);
            // console.log("NORMAL IMAGE:", imageG_Normal);
            // console.log("SHINY IMAGE:", imageG_Shiny);
         };


         // PRIMARY
         // various variants: mf (male/female), md (male), fd (female), fo (female only), mo (male only), uk (unknown)
         const pokemonP = pokemons.find(poke => poke.primary);
         const imagesP_Normals = images.filter(img => (!img.details.gigantamax && (img.details.variant === '000') && !img.details.shiny));
         const imagesP_Shinies = images.filter(img => (!img.details.gigantamax && (img.details.variant === '000') && img.details.shiny));
         const genderMap = new Map();

         imagesP_Normals.forEach(ni => {
            genderMap.set(ni.details.gender, [ni]);
         });

         imagesP_Shinies.forEach(si => {
            genderMap.get(si.details.gender).push(si);
         });

         // console.log("_____ PRIMARY _____");
         // console.log("POKEMON:", pokemonP);
         // console.log("GENDER MAP:", genderMap);

         // pokemon with female variants will need to create a new pokemon as the female form
         if (genderMap.get('md') || genderMap.get('fd')) {
            const imagesMale = genderMap.get('md');
            const imagesFemale = genderMap.get('fd');

            // make sure that both male and female images exist
            if ((imagesMale && !imagesFemale) || (!imagesMale && imagesFemale)) {
               console.error("********** ERROR **********");
               console.error("MALE AND FEMALE MISMATCH!")
            }
            else {
               await Pokemon.create({
                  generation: 1,
                  name: pokemonP.name + " ♂",
                  nationalPokedexNumber,
                  primary: false,
                  images: {
                     normal: imagesFemale[0]._id,
                     shiny: imagesFemale[1]._id
                  }
               });

               // const femalePokemon = {
               //    generation: 1,
               //    name: pokemonP.name + "♂",
               //    nationalPokedexNumber,
               //    primary: false,
               //    images: {
               //       normal: imagesFemale[0]._id,
               //       shiny: imagesFemale[1]._id
               //    }
               // };

               pokemonP.images.normal = imagesMale[0]._id;
               pokemonP.images.shiny = imagesMale[1]._id;
               await pokemonP.save();

               // console.log("MALE IMAGES:", imagesMale);
               // console.log("FEMALE IMAGES:", imagesFemale);
               // console.log("FEMALE POKEMON:", femalePokemon);
            };

         }
         else {
            pokemonP.images.normal = imagesP_Normals[0]._id;
            pokemonP.images.shiny = imagesP_Shinies[0]._id;
            await pokemonP.save();

            // console.log("NORMAL IMAGES:", imagesP_Normals);
            // console.log("SHINY IMAGES:", imagesP_Shinies);
         };

         // OTHER
         // this can include Mega Evolutions or regional variants
         const pokemonO = pokemons.filter(poke => !poke.name.includes("Gigantamax") && !poke.primary);

         // only 1 variant: mf (male/female)
         if (pokemonO.length === 1) {
            const imageO_Normal = images.find(img => ((!img.details.gigantamax && (Number(img.details.variant) > 0) && !img.details.shiny)));
            const imageO_Shiny = images.find(img => ((!img.details.gigantamax && (Number(img.details.variant) > 0) && img.details.shiny)));

            pokemonO[0].images.normal = imageO_Normal._id;
            pokemonO[0].images.shiny = imageO_Shiny._id;
            await pokemonO[0].save();

            // console.log("_____ OTHER VARIANTS _____");
            // console.log("POKEMON:", pokemonO);
            // console.log("NORMAL IMAGE:", imageO_Normal);
            // console.log("SHINY IMAGE:", imageO_Shiny);
         };

         // 
         if (pokemonO.length > 1) {
            const imagesO_Normals = images.filter(img => ((!img.details.gigantamax && (Number(img.details.variant) > 0) && !img.details.shiny)));
            const imagesO_Shinies = images.filter(img => ((!img.details.gigantamax && (Number(img.details.variant) > 0) && img.details.shiny)));

            console.error("MORE THAN ONE VARIANT:", pokemonO);
            console.error("NORMAL IMAGES:", imagesO_Normals);
            console.error("SHINY IMAGES:", imagesO_Shinies);
         };

         console.log('Updated Pokedex#:', nationalPokedexNumber);
      };

      return res.status(200).json('done');
   }
   catch (error) { next(error) }
};

export {
   createImage,
   getImages,
   linkImagesWithPokemon
};