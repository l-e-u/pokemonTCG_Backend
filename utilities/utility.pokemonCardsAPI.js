import pokemon from 'pokemontcgsdk';

pokemon.configure({ apiKey: process.env.POKEMONGTCG_API_KEY });

export const getCardsByExpansionId = async (id) => {
   return await pokemon.card.where({ q: `set.id:"${id}"` });
};

export const getCardsByName = async (cardName) => {
   return await pokemon.card.where({ q: `name:"${cardName}"` });
};

export const getCardsByNationalPokedexNumber = async (number) => {
   return await pokemon.card.where({ q: `nationalPokedexNumbers:${number}` });
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

export default {
   getCardsByExpansionId,
   getCardsByName,
   getCardsByNationalPokedexNumber,
   getAllSets,
   getSetsById,
   getSetsByName
};