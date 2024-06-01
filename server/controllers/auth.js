import jwt from 'jsonwebtoken';
import  User  from '../models/auth.js';

export const login = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const email = req.body.email;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const newUser = await User.create({ email });

      const token = jwt.sign(
        {
          email: newUser.email,
          id: newUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      return res.status(201).json({ result: newUser, token });
    } else {
      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      return res.status(200).json({ result: existingUser, token });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong...' });
  }
};