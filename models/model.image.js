import { Schema, model as Model } from 'mongoose';

const colorSchema = new Schema({
   area: Number,
   blue: Number,
   green: Number,
   hex: String,
   hue: Number,
   intensity: Number,
   lightness: Number,
   red: Number,
   saturation: Number,
});

const imageSchema = new Schema(
   {
      file: String,
      height: Number,
      size: Number,
      width: Number,
      url: String,
      extname: { type: String },
      imgur: {
         id: String,
         deleteHash: String
      },
      colorPalette: [colorSchema],
   },
   { timestamps: true }
);

colorSchema.virtual('rgb').get(function () {
   return [this.red, this.green, this.blue];
});

colorSchema.virtual('areaPercentage').get(function () {
   return this.area * 100;
});

imageSchema.virtual('filename').get(function () {
   return this.file + this.extname;
});

export default Model('Image', imageSchema);