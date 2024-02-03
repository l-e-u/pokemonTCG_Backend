import Image from '../models/model.image.js';

const createImage = async (req, res, next) => {
   try {
      const image = await Image.create({ ...req.body })

      return res.status(200).json(image);
   }
   catch (error) { next(error) }
};

const createImages = async (req, res, next) => {
   try {
      const docs = req.body;
      const images = await Image.insertMany(docs);

      return res.status(200).json(images);
   }
   catch (error) { next(error) }
};

export {
   createImage,
   createImages,
};