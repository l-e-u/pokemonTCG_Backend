import { Schema, model as Model } from 'mongoose';

const seriesSchema = new Schema(
   {
      expansions: [{
         ref: 'Expansion',
         type: Schema.Types.ObjectId

      }],
      name: {
         required: true,
         type: String,
         unique: true,
      }
   },
   { timestamps: true }
);

export default Model('Series', seriesSchema);