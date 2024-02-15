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
      const isDebugging = false;

      for (let nationalPokedexNumber = 906; nationalPokedexNumber < 1026; nationalPokedexNumber++) {
         const pokemons = await Pokemon.find({ nationalPokedexNumber });
         const images = await Image.find({ file: { $regex: `_${nationalPokedexNumber.toString().padStart(4, "0")}_`, $options: 'i' } });

         // GIGANTAMAX
         // only 1 variant: mf (male/female)
         const pokemonG = pokemons.find(poke => poke.name.includes("Gigantamax"));
         const imageG_Normal = images.find(img => img.details.gigantamax && !img.details.shiny);
         const imageG_Shiny = images.find(img => img.details.gigantamax && img.details.shiny);

         if (pokemonG) {
            pokemonG.images.normal = imageG_Normal._id;
            pokemonG.images.shiny = imageG_Shiny._id;

            if (!isDebugging) await pokemonG.save();

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
               console.error("MALE AND FEMALE MISMATCH!", nationalPokedexNumber)
               console.log(genderMap)
            }
            else {
               const femalePokemon = {
                  generation: 1,
                  name: pokemonP.name + "♂",
                  nationalPokedexNumber,
                  primary: false,
                  images: {
                     normal: imagesFemale[0]._id,
                     shiny: imagesFemale[1]._id
                  }
               };

               if (!isDebugging) await Pokemon.create(femalePokemon);

               pokemonP.images.normal = imagesMale[0]._id;
               pokemonP.images.shiny = imagesMale[1]._id;

               if (!isDebugging) await pokemonP.save();

               // console.log("MALE IMAGES:", imagesMale);
               // console.log("FEMALE IMAGES:", imagesFemale);
               // console.log("FEMALE POKEMON:", femalePokemon);
            };

         }
         else {
            pokemonP.images.normal = imagesP_Normals[0]._id;
            pokemonP.images.shiny = imagesP_Shinies[0]._id;

            if (!isDebugging) await pokemonP.save();

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

            if (!isDebugging) await pokemonO[0].save();

            // console.log("_____ OTHER VARIANTS _____");
            // console.log("POKEMON:", pokemonO);
            // console.log("NORMAL IMAGE:", imageO_Normal);
            // console.log("SHINY IMAGE:", imageO_Shiny);
         };

         // if needed, enter logic for specific pokemon and their variants
         if (pokemonO.length > 1) {
            const imagesO_Normals = images.filter(img => ((!img.details.gigantamax && (Number(img.details.variant) > 0) && !img.details.shiny)));
            const imagesO_Shinies = images.filter(img => ((!img.details.gigantamax && (Number(img.details.variant) > 0) && img.details.shiny)));

            if (isDebugging) {
               console.error("MORE THAN ONE VARIANT:", pokemonO.length, pokemonO.map(p => p.name));
               console.error("NORMAL IMAGES:", imagesO_Normals.map(({ file, url }) => ({ file, url })));
               console.error("SHINY IMAGES:", imagesO_Shinies.map(({ file, url }) => ({ file, url })));
            };

            const matchVariant = async (poke, variant) => {
               const imgVarN = imagesO_Normals.find(img => Number(img.details.variant) === variant);
               const imgVarS = imagesO_Shinies.find(img => Number(img.details.variant) === variant);

               poke.images.normal = imgVarN._id;
               poke.images.shiny = imgVarS._id;

               // console.log('Variant Match Up:');
               // console.log('Pokemon Name:', poke.name);
               // console.log('Normal Variant:', imgVarN.file);
               // console.log('Shiny Variant:', imgVarS.file);

               if (!isDebugging) await poke.save()
            };

            for (let index = 0; index < pokemonO.length; index++) {
               const p = pokemonO[index];
               console.log('#', index, p.name);

               if (nationalPokedexNumber === 1017) {
                  if (p.name === "Ogerpon (Cornerstone Mask)") {
                     p.name = "Ogerpon Cornerstone Mask";
                     p.elements.push('grass', 'rock');
                     matchVariant(p, 3);
                     continue;
                  };


                  if (p.name === "Ogerpon (Hearthflame Mask)") {
                     p.name = "Ogerpon Hearthflame Mask";
                     p.elements.push('grass', 'fire');
                     matchVariant(p, 2);
                     continue;
                  };


                  if (p.name === "Ogerpon (Wellspring Mask)") {
                     p.name = "Ogerpon Wellspring Mask";
                     p.elements.push('grass', 'water');
                     matchVariant(p, 1);
                     continue;
                  };


               };

               if (nationalPokedexNumber === 1024) {
                  if (p.name === "Terapagos (Terastal Form)") {
                     p.name = "Terapagos Terastal Form";
                     p.elements.push('normal');
                     matchVariant(p, 1);
                     continue;
                  };

                  if (p.name === "Terapagos (Stellar Form)") {
                     p.name = "Terapagos Stellar Form"
                     p.elements.push('normal');
                     const img = imagesO_Normals.find(img => Number(img.details.variant) === 2);
                     p.images.normal = img._id;
                     continue;
                  };
               };

               console.error("________________________________________NO LINK FOR:", p.nationalPokedexNumber)
            };


         };

         console.log('Updated Pokedex#:', nationalPokedexNumber);
      };

      return res.status(200).json('done');
   }
   catch (error) {
      console.log("CAUGHT:", error);
      next(error);
   }
};

const deleteImage = async (req, res, next) => {
   try {
      const { id } = req.query;
      let deletedImage = null;

      const image = await Image.findOne({ 'imgur.id': id });

      if (image) {
         const response = await fetch(`https://api.imgur.com/3/image/${image.imgur.deleteHash}`, {
            method: "DELETE",
            headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
            redirect: "follow"
         });

         const json = await response.json();

         if (response.ok) {
            console.log("Deleted from Imgur.")
            deletedImage = await image.deleteOne()
         }

         if (!response.ok) {
            console.log('Image was not deleted.');
            console.error(json);
            throw json;
         }
      }

      return res.status(200).json(deletedImage);
   }
   catch (error) { next(error) }
}

export {
   createImage,
   deleteImage,
   getImages,
   linkImagesWithPokemon
};