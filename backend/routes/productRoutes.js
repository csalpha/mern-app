import express from 'express';
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get(
    '/categories',
    expressAsyncHandler( async ( req, res ) =>{
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
);


productRouter.get(
  '/top-products',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find()
      .populate('seller', 'seller.name seller.logo')
      .sort({ rating: -1 })
      .limit(4);
    res.send(products);
  })
);

  productRouter.get(
    '/slug/:slug',
    expressAsyncHandler(async ({ params }, res) => {
      const product = await Product.findOne({ slug: params.slug }).populate(
        'seller',
        'seller.name seller.logo seller.rating seller.numReviews'
      );

      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
      
    })
  );
  


export default productRouter;
