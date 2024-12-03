import { User } from '../models/User.js';

export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find user by ID and exclude the password field
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    username: user.username,
                    _id: user._id,
                    account_balance: user.account_balance,
                    account_data: user.account_data
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
