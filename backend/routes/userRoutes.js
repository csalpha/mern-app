import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const userRouter = express.Router();

userRouter.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3);
    res.send(topSellers);
  })
);

export default userRouter;





