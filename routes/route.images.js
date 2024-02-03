import { Router } from 'express';
import {
   createImage,
   createImages
} from '../controllers/controller.image.js';

const router = Router();

// POST create one image
router.post('/', createImage);

export default router;