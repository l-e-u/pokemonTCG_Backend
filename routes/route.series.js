import { Router } from 'express';
import {
   createSeries,
   getAllSeries,
   getOneSeries,
} from '../controllers/controller.series.js';

const router = Router();

// GET all serires
router.get('/', getAllSeries);

// GET one series
router.get('/:name', getOneSeries);

// POST a new series
router.get('/', createSeries);

export default router;