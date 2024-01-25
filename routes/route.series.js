import { Router } from 'express';
import {
   getAllSeries,
   getOneSeries,
} from '../controllers/controller.series.js';

const router = Router();

// GET all serires
router.get('/', getAllSeries);

// GET one series
router.get('/:name', getOneSeries);

export default router;