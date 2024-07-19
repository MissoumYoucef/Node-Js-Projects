const User = require('../models/User');

exports.addSubAdmin = async (req, res) => {
    const { username, email, password } = req.body;
    const admin = await User.findById(req.user.id);

    if (admin.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    const subAdmin = await User.create({
        username,
        email,
        password,
        role: 'sub-admin',
    });
    res.status(201).json({
        _id: subAdmin._id,
        username: subAdmin.username,
        email: subAdmin.email,
    });
};
