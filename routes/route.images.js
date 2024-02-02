import { Router } from 'express';
import {
   createImage
} from '../controllers/controller.image.js';

const router = Router();

// PUT create one image
router.put('/', createImage);

export default router;