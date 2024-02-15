import { Schema, model as Model } from 'mongoose';

const expansionSchema = new Schema(
   {
      abbreviation: String,
      altId: String,
      name: String,
      released: Date,
      cards: [{
         ref: 'Card',
         type: Schema.Types.ObjectId
      }],
      count: {
         printed: Number,
         total: Number
      },
      images: {
         logoURL: String,
         symbolURL: String
      },
   },
   { timestamps: true }
);

export default Model('Expansion', expansionSchema);