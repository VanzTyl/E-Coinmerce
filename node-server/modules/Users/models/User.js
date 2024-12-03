// _modules/Users/models/User.js
import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    account_data: {
        type: [
            {
                positions: {
                    type: [
                        {
                            position_id: {
                                type: String,
                                required: false,
                            },
                            coin_id: {
                                type: String,
                                required: false,
                            },
                            bought_price: {
                                type: Number,
                                required: false,
                            },
                            bought_amount: {
                                type: Number,
                                required: false,
                            },
                        }
                    ]
                }
            }
        ]
    },
    account_balance:{
        type: Number,
        required: true,
        default: 1000,
    }
  },
  {
    timestamps: true,
  }
);

// Create a model based on the schema
export const User = mongoose.model('users', userSchema);