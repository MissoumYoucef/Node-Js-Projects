const express = require('express');
const router = express.Router();
const passport = require('passport');
const Form = require('../models/Form');
const Response = require('../models/Response');

// Create Form Page
router.get('/create', passport.authenticate('jwt', { session: false }), (req, res) => res.render('createForm'));

// Create Form
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { title, fields } = req.body;
  const newForm = new Form({
    title,
    user: req.user.id,
    fields: JSON.parse(fields)
  });

  newForm.save()
    .then(form => {
      req.flash('success_msg', 'Form created successfully');
      res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});

// View Form
router.get('/:id', (req, res) => {
  Form.findById(req.params.id)
    .then(form => {
      if (!form) {
        req.flash('error_msg', 'Form not found');
        return res.redirect('/dashboard');
      }
      res.render('viewForm', { form });
    })
    .catch(err => console.log(err));
});

// Submit Response
router.post('/:id/submit', (req, res) => {
  const { answers } = req.body;
  const newResponse = new Response({
    form: req.params.id,
    answers: JSON.parse(answers)
  });

  newResponse.save()
    .then(response => {
      req.flash('success_msg', 'Response submitted successfully');
      res.redirect(`/forms/${req.params.id}`);
    })
    .catch(err => console.log(err));
});

module.exports = router;
