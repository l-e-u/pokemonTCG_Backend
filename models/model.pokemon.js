import { Schema, model as Model } from 'mongoose';

const pokemonSchema = new Schema({
   elements: [{
      ref: 'Element',
      type: Schema.Types.ObjectId
   }],
   evolves: {
      from: [{
         default: null,
         ref: 'Pokemon',
         type: Schema.Types.ObjectId
      }],
      to: [{
         default: null,
         ref: 'Pokemon',
         type: Schema.Types.ObjectId
      }]
   },
   forms: [{
      version: String,
      ref: 'Pokemon',
      type: Schema.Types.ObjectId
   }],
   name: String,
   pokedexNumber: Number
})

export default Model('Pokemon', pokemonSchema);