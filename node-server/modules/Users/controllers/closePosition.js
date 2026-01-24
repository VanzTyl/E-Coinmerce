import { User } from '../models/User.js';

export const closePosition = async (req, res) => {
    try {
        const { userId, positionId } = req.params;
        const { currentPrice } = req.body;

        console.log('Received close position request:', {
            userId,
            positionId,
            currentPrice
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Ensure account_data exists
        if (!user.account_data || !user.account_data[0] || !user.account_data[0].positions) {
            return res.status(404).json({ 
                success: false, 
                message: 'No positions found' 
            });
        }

        // Find the position
        const positionIndex = user.account_data[0].positions.findIndex(
            pos => pos.position_id === positionId
        );

        if (positionIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Position not found' 
            });
        }

        // Get the position details
        const position = user.account_data[0].positions[positionIndex];

        // Calculate profit/loss
        const profitLoss = (currentPrice - position.bought_price) * position.bought_amount;
        
        // Calculate total return (initial investment + profit/loss)
        const totalReturn = (position.bought_price * position.bought_amount) + profitLoss;

        // Update user's balance
        user.account_balance += totalReturn;

        // Remove the position
        user.account_data[0].positions.splice(positionIndex, 1);

        // Save the changes
        await user.save();

        console.log('Position closed successfully:', {
            profitLoss,
            totalReturn,
            newBalance: user.account_balance
        });

        return res.status(200).json({
            success: true,
            data: {
                closed_position: position,
                profit_loss: profitLoss,
                total_return: totalReturn,
                new_balance: user.account_balance
            }
        });
    } catch (error) {
        console.error('Error closing position:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
}; 