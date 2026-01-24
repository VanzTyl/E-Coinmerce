// Import the database model 'coins' from the mongoose schema
import { Coin } from "../models/Coins.js";

export const fetchCoin = async (req, res) =>{
    try{
        const coinSymbol = req.params.coinSymbol;

        console.log(`Fetched coin symbol: ${coinSymbol}`)

        // Your logic to fetch the coin from the database by symbol
        const coin = await Coin.findOne({ coin_symbol: coinSymbol });
        
        if (!coin) {
            return res.status(404).json({ message: 'Coin not found' });
        }

        return res.status(200).json(coin);
    } catch (error) {
        console.error('Error fetching coin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// New function to fetch latest prices
export const fetchLatestPrices = async (req, res) => {
    try {
        const coinSymbol = req.params.coinSymbol;

        const coin = await Coin.findOne(
            { coin_symbol: coinSymbol }
        );

        if (!coin) {
            return res.status(404).json({ message: 'Coin not found' });
        }

        // Sort prices by timestamp
        const sortedPrices = coin.prices.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        return res.status(200).json({
            ...coin.toObject(),
            prices: sortedPrices
        });
    } catch (error) {
        console.error('Error fetching latest prices:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const fetchMinimalCoinsData = async (req, res) => {
    try {
        const coins = await Coin.aggregate([
            {
                $project: {
                    coin_name: 1,
                    coin_symbol: 1,
                    latest_price: { $last: "$prices.price" }
                }
            }
        ]);
        
        return res.status(200).json(coins);
    } catch (error) {
        console.error('Error fetching minimal coins data:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}


