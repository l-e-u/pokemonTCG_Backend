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
      normal: String,
      shiny: String
   }
});

export default Model('Pokemon', pokemonSchema);