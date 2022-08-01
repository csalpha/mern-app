import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// define app from express
const app = express();

// the form data in the post request will be converted 
// a json object inside req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/ecommerce');

// create a api to return PAYPAL_CLIENT_ID
app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
  });

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
    res.send("Server is ready");
});

// Define error handler for express
app.use((err, req, res, next) => {
    // error in the server
    res.status(500).send({ message: err.message });
});


app.listen(5000, () => {
    console.log('Serve at http://localhost:5000');
});