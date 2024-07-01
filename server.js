const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// To store results
let results = [];

// Middleware
app.use(bodyParser.json());

// CORS middleware to allow requests from any origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Endpoint to receive results
app.post('/api/results', (req, res) => {
  const result = req.body.result;
  if (result) {
    results.push(result);
    res.status(201).send({ message: 'Result stored' });
  } else {
    res.status(400).send({ message: 'Invalid input' });
  }
});

// Endpoint to get all results
app.get('/api/results', (req, res) => {
  res.status(200).send(results);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




how change my in that the text translation start with black color and when i speak camera one text color should change into green, and when i speak camera two text color chnage into yellow, when i speak camera three text color chnage into blue and when i say camera four text color change into red. The text i mean the output 