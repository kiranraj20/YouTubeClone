import User from '../models/auth.js';

export const message = async (req, res) => {
  const { from, to, message } = req.body; 

  console.log(from, to, message);
  try {
    const user = await User.findOne({ email: to });

    if (!user) {
      return res.status(404).json({ message: 'No User Found By This Email.' });
    }

    // Add the new message to the messages array
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          messages: {
            email: from,
            message: message,
          },
        },
      },
      { new: true }
    );

    // Ensure the messages array does not exceed 10 items
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          messages: { $each: [], $slice: -10 }
        }
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
