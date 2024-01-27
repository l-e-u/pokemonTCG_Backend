import { Schema, model as Model } from 'mongoose';

const tcgPlayerSchema = new Schema(
   {
      url: String,
      prices: {
         normal: {
            low: Number,
            mid: Number,
            high: Number,
            market: Number,
            directLow: Number
         },
         holofoil: {
            low: Number,
            mid: Number,
            high: Number,
            market: Number,
            directLow: Number
         },
         reverseHolofoil: {
            low: Number,
            mid: Number,
            high: Number,
            market: Number,
            directLow: Number
         },
         FirstEditionHolofoil: {
            low: Number,
            mid: Number,
            high: Number,
            market: Number,
            directLow: Number
         },
         FirstEditionNormal: {
            low: Number,
            mid: Number,
            high: Number,
            market: Number,
            directLow: Number
         },
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
      damage: String,
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
   imageURLs: {
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
      elementType: {
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
      elementType: {
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