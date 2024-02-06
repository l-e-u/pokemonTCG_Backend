import { Schema, model as Model } from 'mongoose';

const colorSchema = new Schema(
   {
      area: Number,
      blue: Number,
      green: Number,
      hex: String,
      hue: Number,
      intensity: Number,
      lightness: Number,
      red: Number,
      saturation: Number,
   },
   {
      toJSON: {
         transform: function (doc, json) {
            const removeProps = ["_id", "id", "area"];

            removeProps.forEach(prop => delete json[prop]);
         },
         virtuals: true
      }
   }
);

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
   {
      timestamps: true,
      toJSON: {
         transform: function (doc, json) {
            const removeProps = ["imgur", "file", "extname", "area"];

            removeProps.forEach(prop => delete json[prop]);
            json.colorPalette.sort((a, b) => a.areaPercentage - b.areaPercentage)
         },
         virtuals: false
      }
   }
);

// returns rgb values as an array
colorSchema.virtual('rgb').get(function () {
   return [this.red, this.green, this.blue];
});

// calculates the area to a percentage
colorSchema.virtual('areaPercentage').get(function () {
   return this.area * 100;
});

// provides the full filename including extention
imageSchema.virtual('filename').get(function () {
   return this.file + this.extname;
});

// parses the file name to provide more details about the image
imageSchema.virtual('details').get(function () {
   // parse the file name of the image to get more details
   const parse = this.file.split("_");

   // return if it's a pokemon image
   if (parse[0] === "pokemon") {
      return {
         type: parse[0],
         nationalPokedexNumber: Number(parse[1]),
         gender: parse[3],
         shiny: parse[7] === "r",
         variant: parse[2],
         gigantamax: parse[4] === "g"
      };
   };

   return null;
});

export default Model('Image', imageSchema);