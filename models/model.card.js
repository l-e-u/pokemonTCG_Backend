import { Schema, model as Model } from 'mongoose';

const cardSchema = new Schema({
   abilities: [{
      name: {
         lowercase: true,
         type: String
      },
      text: String,
      type: { type: String }
   }],
   attacks: [{
      costs: [{
         elementType: {
            lowercase: true,
            type: String
         },
         quantity: Number
      }],
      damage: Number,
      name: {
         lowercase: true,
         type: String
      },
      text: String
   }],
   elementTypes: [{
      lowercase: true,
      type: String
   }],
   expansion: {
      ref: 'Expansion',
      type: Schema.Types.ObjectId
   },
   hp: Number,
   illustrator: String,
   imagesURL: {
      small: String,
      large: String,
   },
   level: String,
   name: String,
   number: String,
   pokemon: [{
      ref: 'Pokemon',
      type: Schema.Types.ObjectId
   }],
   rarity: {
      lowercase: true,
      type: String,
   },
   resistances: [{
      type: {
         lowercase: true,
         type: String
      },
      value: {
         lowercase: true,
         type: String
      }
   }],
   retreatCosts: [{
      elementType: {
         lowercase: true,
         type: String
      },
      quantity: Number
   }],
   rules: [String],
   text: String,
   subTypes: [{
      lowercase: true,
      type: String
   }],
   superType: {
      type: String,
      set: (text) => {
         if ((text === 'pokémon') || (text === 'Pokémon') || (text === 'POKÉMON')) {
            text = 'pokemon';
         };

         return text.toLowerCase();
      }
   },
   weaknesses: [{
      type: {
         lowercase: true,
         type: String
      },
      value: {
         lowercase: true,
         type: String
      }
   }],
});

export default Model('Card', cardSchema);