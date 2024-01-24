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
   generation: Number,
   imageURL: String,
   name: String,
   nationalPokedexNumber: Number
})

export default Model('Pokemon', pokemonSchema);