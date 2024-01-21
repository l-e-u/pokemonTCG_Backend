import Series from '../models/model.series.js';

// GET all series
const getAllSeries = async (req, res, next) => {
   try {
      const series = await Series.find({}).sort({ name: 1 });

      return res.status(200).json(series);
   }

   catch (error) { next(error) }
};

// GET one series
const getOneSeries = async (req, res, next) => {
   const { name } = req.params;

   try {
      const series = await Series.findOne({ name });

      return res.status(200).json(series);
   }

   catch (error) { next(error) }
};

// POST new series
const createSeries = async (req, res, next) => {
   try {
      const series = await Series.create({ ...req.body });

      return res.status(200).json(series);
   }

   catch (error) { next(error) }
};

export {
   createSeries,
   getAllSeries,
   getOneSeries,
}