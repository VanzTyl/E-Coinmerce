import { User } from '../models/User.js';
import mongoose from 'mongoose';

export const openPosition = async (req, res) => {
    try {
        const { userId } = req.params;
        const { coin_id, bought_price, bought_amount, total_cost } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check balance
        if (user.account_balance < total_cost) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // Create new position
        const position = {
            position_id: new mongoose.Types.ObjectId().toString(),
            coin_id,
            bought_price,
            bought_amount
        };

        // Update user's balance and add position
        if (!user.account_data || user.account_data.length === 0) {
            user.account_data = [{ positions: [position] }];
        } else {
            user.account_data[0].positions.push(position);
        }
        
        user.account_balance -= total_cost;
        await user.save();

        return res.status(200).json({ success: true, data: { position, new_balance: user.account_balance } });
    } catch (error) {
        console.error('Error opening position:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}; 