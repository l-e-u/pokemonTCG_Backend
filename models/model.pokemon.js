import { Schema, model as Model } from 'mongoose';

const pokemonSchema = new Schema({
   generation: Number,
   imageURL: String,
   name: String,
   nationalPokedexNumber: Number,
   primary: Boolean,
   cards: [{
      ref: 'Card',
      type: Schema.Types.ObjectId
   }],
   elements: [{
      lowercase: true,
      type: String
   }],
   evolves: {
      from: [{
         ref: 'Pokemon',
         type: Schema.Types.ObjectId
      }],
      to: [{
         ref: 'Pokemon',
         type: Schema.Types.ObjectId
      }]
   },
   images: {
      normal: {
         ref: 'Image',
         type: Schema.Types.ObjectId
      },
      shiny: {
         ref: 'Image',
         type: Schema.Types.ObjectId
      }
   }
});

export default Model('Pokemon', pokemonSchema);