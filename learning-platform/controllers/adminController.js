const User = require('../models/User');

exports.addSubAdmin = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'sub-admin';
    await user.save();

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    });
};
