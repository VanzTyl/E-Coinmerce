// Import bcrypt for password encryption
import bcrypt from 'bcrypt';

// Import the database model 'users' from the mongoose schema
import { User } from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { username, password, confirmation_pass } = req.body;

    // Check if the passwords match
    if (password !== confirmation_pass) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with that username.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error('Registration error:', err); // Add more specific logging
    return res.status(500).json({ message: 'Server error' });
  }
};
