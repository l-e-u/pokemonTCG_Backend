import Series from '../models/model.series.js';

// GET all series
const getAllSeries = async (req, res, next) => {
   try {
      const series = await Series.find({}).populate('expansions');

      // Sort the expansion elements based on their release date
      series.forEach(({ expansions }) => expansions.sort((a, b) => a.released - b.released));

      // Sor the serires based on the first expansion's release date
      series.sort((s1, s2) => s1.expansions[0].released - s2.expansions[0].released)

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

export {
   getAllSeries,
   getOneSeries,
};