import { Router } from 'express';
import {
   createImage,
   deleteImage,
   getImages,
   linkImagesWithPokemon
} from '../controllers/controller.image.js';

const router = Router();

// GET images based on query
router.get('/', getImages)

// POST create one image
router.post('/', createImage);

router.patch('/', linkImagesWithPokemon)

// DELETE an image
router.delete('/', deleteImage)

export default router;