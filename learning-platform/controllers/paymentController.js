const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');

exports.createPaymentIntent = async (req, res) => {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: course.price * 100,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
};
