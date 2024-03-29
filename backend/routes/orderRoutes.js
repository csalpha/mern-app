import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import {
  isAuth
} from '../utils.js';

const orderRouter = express.Router();


// implement api for post
// send post request to '/' api
orderRouter.post(
  '/',
  // define a middleware
  isAuth, // fill the user of the request
  // catch all errors
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      // define order
      const order = new Order({
        seller: req.body.orderItems[0].seller,

        // convert _id to product
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),

        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });

      // save new order
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    }
  })
);

// implement api for get
// send get request to '/:id' api
orderRouter.get(
  '/:id',
  // define a middleware
  isAuth,// fill the user of the request
   // catch all errors
  expressAsyncHandler(async (req, res) => {

    // search order in the database and return it to the frontend
    // findById it's a function from mongoose
    // What we pass is a id that user entred in the url
    const order = await Order.findById(req.params.id);

    // check if order does exist
    if (order) {
      // return order
      res.send(order);
    } else {
      // return error message
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);


export default orderRouter;
