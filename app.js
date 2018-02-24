const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/jot-a-thought', {
  // useMongoClient: true // No longer needed
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model / Schema
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'))

// ==========
//   ROUTES
// ==========

// Index Route
app.get('/', (req, res) => {
  const title = 'JotAThought';
  res.render('index', {
    title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Ideas Index Page
app.get('/ideas', (req, res) => {
  // Retreive all the ideas
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  // Find the idea by id
  Idea.findOne({
    _id: req.params.id
  })
  // Render page with found idea
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  })
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title) {
    errors.push({ text: 'Please add a title'})
  }
  if(!req.body.details) {
    errors.push({ text: 'Please add a details'})
  }

  // If errors rerender form with the original data and the errors
  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title:req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      });
  }
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    // save new data
    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  })
});

const port = 5000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});