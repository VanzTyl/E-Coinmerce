// Import ORM Library for mongoose to create a schema
import mongoose from "mongoose";

const coinSchema = new mongoose.Schema(
    {
        coin_id: {
            type: String,
            required: true,
        },
        coin_name: {
            type: String,
            required: true,
        },
        coin_symbol: {
            type: String,
            required: true,
        },
        prices: [
            {
                price: {
                    type: Number, required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            }
        ]
    },
    {
        timestamps: true,
    }
)

export const Coin = mongoose.model('coins', coinSchema);