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

export default productRouter;
