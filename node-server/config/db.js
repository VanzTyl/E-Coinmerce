import mongoose from 'mongoose'; // ORM Library for MongoDB

// MongoDB Setup
const mongoURI = 'mongodb://localhost:27017/E-Coinmerce';

const database = mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

export default database;
