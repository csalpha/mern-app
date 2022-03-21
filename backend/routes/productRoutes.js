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
        .populate()
        .limit(5);
      res.send(products);
    })
  );

export default productRouter;
