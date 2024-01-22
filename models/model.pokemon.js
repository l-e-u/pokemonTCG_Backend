import { Schema, model as Model } from 'mongoose';

const pokemonSchema = new Schema({
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
   forms: [{
      ref: 'Pokemon',
      type: Schema.Types.ObjectId
   }],
   name: String,
   pokedexNumber: Number
})

export default Model('Pokemon', pokemonSchema);