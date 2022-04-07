import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';

// create userRouter
const userRouter = express.Router();


// define get request
userRouter.get(
  '/top-sellers',
  // catch the error in async function
  expressAsyncHandler(async (req, res) => {

    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3);
    res.send(topSellers);
  })
);

// define post request for Sign In api
userRouter.post(
  '/signin',
  // catch the error in async function
  expressAsyncHandler(async (req, res)=>{
    // get the user by email
    // return one document from the user collection based on email
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    // if user exist
    if(user){
      
      //checking the password
      // 1st parameter - plain text password
      // 2nd parameter - encrypted password in the database
      if(bcrypt.compareSync(req.body.password, user.password)){
        // send all user informatio
        
        
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user), //generate token
        });
        // exit after sending data
        return;
      }
    }

    // if email or password is incorrect
    res.status(401).send({ message: 'Invalid email or password' });

  })
);

export default userRouter;






