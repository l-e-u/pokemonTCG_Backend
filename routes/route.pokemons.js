import { Router } from 'express';
import {
   // createPokemon,
   getAllPokemon,
   getListOfPokemonNames,
   getOnePokemonByName,
} from '../controllers/controller.pokemon.js';

const router = Router();

// GET all pokemon
router.get('/', getAllPokemon);

router.get('/search/:name', getListOfPokemonNames);

// GET one pokemon
router.get('/:name', getOnePokemonByName);

// POST a new pokemon
// router.post('/', createPokemon);

export default router;