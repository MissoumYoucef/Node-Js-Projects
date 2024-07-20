const Course = require('../models/Course');

exports.addCourse = async (req, res) => {
    const { title, description, price } = req.body;

    const course = await Course.create({
        title,
        description,
        price,
        createdBy: req.user.id,
    });

    res.status(201).json(course);
};

exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const course = await Course.findById(id);

    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;

    const updatedCourse = await course.save();

    res.json(updatedCourse);
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    await course.deleteOne(); 

    res.json({ message: 'Course removed' });
};
