// Import express library for declaring a router with corresponding functions from pre-made controllers
import express from 'express'

// Import controllers
import { registerUser } from '../controllers/userRegister.js';
import { userLogin } from '../controllers/userLogin.js';
import { getUserDetails } from '../controllers/getUserDetails.js';
import { openPosition } from '../controllers/openPosition.js';
import { closePosition } from '../controllers/closePosition.js';

// Declare router
export const user_router = express()

// Declare routes
user_router.post('/register', registerUser)
user_router.post('/login', userLogin)
user_router.get('/:userId', getUserDetails)
user_router.post('/:userId/positions', openPosition)
user_router.delete('/:userId/positions/:positionId', closePosition)