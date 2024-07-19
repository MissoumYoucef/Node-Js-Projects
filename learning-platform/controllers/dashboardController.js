const User = require('../models/User');
const Course = require('../models/Course');

exports.adminDashboard = async (req, res) => {
    const users = await User.find({});
    const courses = await Course.find({});

    res.json({ users, courses });
};
