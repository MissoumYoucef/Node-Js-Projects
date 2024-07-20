const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');

exports.createPaymentIntent = async (req, res) => {
    const { _id } = req.body;
    console.log(_id);
    const course = await Course.findById(_id);

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
