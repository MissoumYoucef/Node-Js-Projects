const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const Response = require('../models/Response');
const authenticateToken = require('../config/verifyJwt');

// Create Form Page
router.get('/create', authenticateToken, (req, res) => res.render('createForm'));

// Create Form
router.post('/create', authenticateToken, (req, res) => {
  const { title, fields } = req.body;
  
  console.log(fields);

  // Check if fields is a string and parse if necessary
  let parsedFields;
  try {
    parsedFields = typeof fields === 'string' ? JSON.parse(fields) : fields;
  } catch (e) {
    return res.status(400).json({ msg: 'Invalid fields format' });
  }

  const newForm = new Form({
    title,
    user: req.user.id,
    fields: parsedFields
  });

  newForm.save()
    .then(form => {
      req.flash('success_msg', 'Form created successfully');
      res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});

// View Form
router.get('/:id', authenticateToken, (req, res) => {
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
router.post('/:id/submit',authenticateToken, (req, res) => {
  const { form , answers } = req.body;
  console.log(req.body);

  const newResponse = new Response({
    // form: req.params.id,
    form: form,
    answers: answers
  });

  newResponse.save()
    .then(response => {
      req.flash('success_msg', 'Response submitted successfully');
      res.redirect(`/forms/${req.params.id}`);
    })
    .catch(err => console.log(err));
});

module.exports = router;
