import { Router } from 'express';
import {
   createImage,
   getImages,
   linkImagesWithPokemon
} from '../controllers/controller.image.js';

const router = Router();

// GET images based on query
router.get('/', getImages)

// POST create one image
router.post('/', createImage);

router.patch('/', linkImagesWithPokemon)

export default router;