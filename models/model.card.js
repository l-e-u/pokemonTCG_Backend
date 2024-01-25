import { Schema, model as Model } from 'mongoose';

const tcgPlayerSchema = new Schema(
   {
      url: String,
      prices: {
         holofoil: {
            low: Number,
            mid: Number,
            high: Number,
            market: Number,
            directLow: Number
         }
      }
   },
   { timestamps: true }
);

const cardMarketSchema = new Schema(
   {
      url: String,
      prices: {
         averageSellPrice: Number,
         lowPrice: Number,
         trendPrice: Number,
         suggestedPrice: Number,
         reverseHoloSell: Number,
         reverseHoloLow: Number,
         reverseHoloTrend: Number,
         lowPricePlus: Number,
         avg1: Number,
         avg7: Number,
         avg30: Number,
         reverseHoloAvg1: Number,
         reverseHoloAvg7: Number,
         reverseHoloAvg30: Number
      }
   },
   { timestamps: true }
);

const cardSchema = new Schema({
   altId: String,
   hp: Number,
   illustrator: String,
   level: String,
   name: String,
   number: String,
   text: String,
   abilities: [{
      name: {
         lowercase: true,
         type: String
      },
      text: String,
      type: { type: String }
   }],
   attacks: [{
      costs: [{
         elementType: {
            lowercase: true,
            type: String
         },
         quantity: Number
      }],
      damage: Number,
      name: {
         lowercase: true,
         type: String
      },
      text: String
   }],
   elementTypes: [{
      lowercase: true,
      type: String
   }],
   expansion: {
      ref: 'Expansion',
      type: Schema.Types.ObjectId
   },
   imagesURL: {
      small: String,
      large: String,
   },
   markets: {
      tcgPlayer: tcgPlayerSchema,
      cardMarket: cardMarketSchema
   },
   rarity: {
      lowercase: true,
      type: String,
   },
   resistances: [{
      type: {
         lowercase: true,
         type: String
      },
      value: {
         lowercase: true,
         type: String
      }
   }],
   retreatCosts: [{
      elementType: {
         lowercase: true,
         type: String
      },
      quantity: Number
   }],
   rules: [String],
   subTypes: [{
      lowercase: true,
      type: String
   }],
   superType: {
      type: String,
      set: (text) => {
         if ((text === 'pokémon') || (text === 'Pokémon') || (text === 'POKÉMON')) {
            text = 'pokemon';
         };

         return text.toLowerCase();
      }
   },
   weaknesses: [{
      type: {
         lowercase: true,
         type: String
      },
      value: {
         lowercase: true,
         type: String
      }
   }],
});

export default Model('Card', cardSchema);