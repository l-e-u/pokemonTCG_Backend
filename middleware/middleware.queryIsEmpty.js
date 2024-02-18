// prevent pulling all documents from any collection at once
export const queryIsEmpty = async (req, res, next) => {
   if (!req.query || Object.keys(req.query).length === 0) {
      return res.status(400).json([]);
   };

   next();
};