import { Router } from 'express';
import {
   createPokemon,
   getAllPokemon,
   getOnePokemonByName,
} from '../controllers/controller.pokemon.js';

const router = Router();

// GET all pokemon
router.get('/', getAllPokemon);

// GET one pokemon
router.get('/:name', getOnePokemonByName);

// POST a new pokemon
router.post('/', createPokemon);

export default router;