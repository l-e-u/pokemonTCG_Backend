import { Schema, model as Model } from 'mongoose';

const elementSchema = new Schema({
   cards: [{
      ref: 'Card',
      type: Schema.Types.ObjectId
   }],
   type: {
      type: String,
      unique: true,
      required: true
   },
   pokemon: [{
      ref: 'Pokemon',
      type: Schema.Types.ObjectId
   }]
});

export default Model('Element', elementSchema)