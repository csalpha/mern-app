import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/ecommerce');

app.get('/', (req, res) => {
    res.send("Server is ready");
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

app.listen(5000, () => {
    console.log('Serve at http://localhost:5000');
});