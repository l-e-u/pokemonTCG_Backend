import Image from '../models/model.image';

const createImage = async (req, res, next) => {
   try {
      const image = await Image.create({ ...req.body })

      return res.status(200).json(image);
   }
   catch (error) { next(error) }
};

export {
   createImage,
};