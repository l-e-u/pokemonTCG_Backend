import pokemon from 'pokemontcgsdk';

pokemon.configure({ apiKey: process.env.POKEMONGTCG_API_KEY });

export const getCardsByPokemonName = async (pokemonName) => {
   return await pokemon.card.where({ q: `name:${pokemonName}` });
};