import { Router } from 'express';
import {
   // createPokemon,
   getAllPokemon,
   getPokemonByNameSearch,
   getOnePokemonByName,
   // updatePokemon
} from '../controllers/controller.pokemon.js';

const router = Router();

// GET all pokemon
router.get('/', getAllPokemon);

// GET a list of pokemon where the name matches the query
router.get('/search/:name', getPokemonByNameSearch);

// GET one pokemon
router.get('/:name', getOnePokemonByName);

// POST a new pokemon
// router.post('/', createPokemon);


export default router;