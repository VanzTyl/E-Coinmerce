// Import express to create a route for the Coins
import express from 'express'

// Import necessary controllers
import { fetchCoin, fetchLatestPrices, fetchMinimalCoinsData } from '../controllers/fetchCoins.js'

// Instantiate the router

export const coin_router = express()

coin_router.get('/get/:coinSymbol', fetchCoin)
coin_router.get('/latest/:coinSymbol', fetchLatestPrices)
coin_router.get('/minimal', fetchMinimalCoinsData)
