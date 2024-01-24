import { Schema, model as Model } from 'mongoose';

const expansionSchema = new Schema(
   {
      cards: [{
         ref: 'Card',
         type: Schema.Types.ObjectId
      }],
      code: String,
      count: {
         printed: Number,
         total: Number
      },
      images: {
         logoURL: String,
         symbolURL: String
      },
      name: String,
      released: Date
   },
   {
      timestamps: true
   }
);

export default Model('Expansion', expansionSchema);