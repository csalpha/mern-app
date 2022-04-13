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

// define post request for Sign Up api
userRouter.post(
  '/signup',
  // catch the error in async function
  expressAsyncHandler(async (req, res) => {
    // create new user from mongoose model
    // create a new instance from User
    // User is comming from UserModel
    const user = new User({
      // fill name/email/password from the input forms
      name: req.body.name,
      email: req.body.email,
      //change plain text password to encripted one in the database
      password: bcrypt.hashSync(req.body.password, 8),
    });


    // save new user in the database
    const createdUser = await user.save();

    // return user data to the frontend
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(createdUser),
    });
  })
);

export default userRouter;






