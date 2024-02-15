import pokemon from 'pokemontcgsdk';

pokemon.configure({ apiKey: process.env.POKEMONGTCG_API_KEY });

export const getCardMarkets = async (id) => {
   return await pokemon.card.where({ q: `id:"${id}"` });
};

// Collects all cards to a specific expansion, the API allows max of 250 per page. It will keep collecting cards page per page untill the end
export const getCardsByExpansionId = async (id) => {
   let page = 0;
   const pageSize = 250;
   let totalCount = 0;

   let cards = [];

   do {
      page++;

      console.log(`Page: ${page}`);

      const response = await pokemon.card.where({ q: `set.id:"${id}"`, pageSize, page });

      // The number of cards in this expansion
      totalCount = response.totalCount;

      console.log(`Count: ${response.data.length}`);

      // Join the page results with the total results
      cards = cards.concat(response.data);

   } while (cards.length < totalCount);

   console.log(`Total: ${totalCount}`);

   return cards;
};

export const getCardsByName = async (cardName) => {
   return await pokemon.card.where({ q: `name:"${cardName}"` });
};

export const getCardsByNationalPokedexNumber = async (number) => {
   return await goThroughAllPages({ q: `nationalPokedexNumbers:${number}` });
};

export const getAllSets = async () => {
   return await pokemon.set.all();
};

export const getSetsById = async (id) => {
   return await pokemon.set.where({ q: `id:"${id}"` })
};

export const getSetsByName = async (name) => {
   return await pokemon.set.where({ q: `name:"${name}"` })
};

export const copyCardToMySchema = (copy) => ({
   altId: copy.id,
   hp: Number(copy.hp || -1),
   illustrator: copy.artist,
   level: copy.level,
   name: copy.name,
   number: copy.number,
   text: copy.flavorText,
   abilities: copy.abilities,
   attacks: copy.attacks?.map(attack => ({
      ...attack,
      costs: groupArrayByElements(attack.cost)
   })),
   elementTypes: copy.types,
   imageURLs: {
      small: copy.images?.small,
      large: copy.images?.large
   },
   markets: {
      tcgPlayer: {
         url: copy.tcgplayer?.url,
         prices: { ...copy.tcgplayer?.prices }
      },
      cardMarket: {
         url: copy.cardmarket?.url,
         prices: copy.cardmarket?.prices
      }
   },
   nationalPokedexNumbers: copy.nationalPokedexNumbers,
   rarity: copy.rarity,
   resistances: copy.resistances?.map(r => ({
      elementType: r.type,
      value: r.value
   })),
   retreatCosts: groupArrayByElements(copy.retreatCost || []),
   rules: copy.rules,
   subTypes: copy.subtypes,
   superType: copy.supertype,
   weaknesses: copy.weaknesses?.map(w => ({
      elementType: w.type,
      value: w.value
   }))
});

const goThroughAllPages = async (query) => {
   let page = 0;
   const pageSize = 250;
   let totalCount = 0;

   let cards = [];

   do {
      page++;

      console.log(`Page: ${page}`);

      const response = await pokemon.card.where({ ...query, pageSize, page });

      // The number of cards in this expansion
      totalCount = response.totalCount;

      console.log(`Count: ${response.data.length}`);

      // Join the page results with the total results
      cards = cards.concat(response.data);

   } while (cards.length < totalCount);

   console.log(`Total: ${totalCount}`);

   return cards;
};

// Used in to group element types from the API cards to my schema on the database
const groupArrayByElements = (array) => {
   return Object.entries(
      array.reduce((map, element) => {
         map[element] = (map[element] || 0) + 1;

         return map;
      }, {}))
      .map(([elementType, quantity]) => ({ elementType, quantity }));
};

export default {
   getCardMarkets,
   getCardsByExpansionId,
   getCardsByName,
   getCardsByNationalPokedexNumber,
   getAllSets,
   getSetsById,
   getSetsByName
};