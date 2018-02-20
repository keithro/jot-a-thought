const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
  const title = 'Jot-A-Thought';
  res.render('index', {
    title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});