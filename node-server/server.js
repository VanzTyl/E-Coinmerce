// Import libraries
import express from 'express'
import cors from 'cors'

// Import router
import { user_router } from './modules/Users/routes/userRoutes.js';
import { coin_router } from './modules/Coins/routes/coinsRoutes.js';

// Import db

import database from './config/db.js';

// Create an instance of express
const app = express();

// Start the server on port 3000 & cors options instantiation
const PORT = 3000;
const allowedOrigins = 'http://localhost:5173'

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

// Use declared cors options
app.use(cors(corsOptions))

// Parse form data to json
app.use(express.json());

app.use('/coins', coin_router)
app.use('/users', user_router)

// Define a simple route for the home page with JSON response
app.get('/', (res) => {
  res.json({ message: `Server hosted in http://localhost:${PORT}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});