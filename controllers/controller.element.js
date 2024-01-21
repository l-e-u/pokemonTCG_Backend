import Element from '../models/model.element.js'

// GET all elements
const getElements = async (req, res, next) => {
   try {
      const elements = await Element.find({}).sort({ type: 1 });

      return res.status(200).json(elements);
   }

   catch (error) { next(error) };
};

// Get one element
const getElement = async (req, res, next) => {
   const { type } = req.params;

   try {
      const element = await Element.findOne({ type });

      return res.status(200).json(element);
   }

   catch (error) { next(error) }
};

// POST new element
const createElement = async (req, res, next) => {
   try {
      const element = await Element.create({ ...req.body });

      return res.status(200).json(element);
   }

   catch (error) { next(error) }
};

export {
   createElement,
   getElement,
   getElements,
};