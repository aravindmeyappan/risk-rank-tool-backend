const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory database (replace with actual database in production)
let database = {};

// Serve static files (if any)
// app.use(express.static('public'));

// Handle GET request to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Save form data
app.post('/save', (req, res) => {
  console.log('Received POST /save request');
  console.log('Request body:', req.body);

  const { assessmentID, selectedTab, formData } = req.body;
  console.log('Assessment ID:', assessmentID);
  console.log('Selected Tab:', selectedTab);
  console.log('Form Data:', formData);

  if (!assessmentID || !selectedTab || !formData) {
    return res.status(400).json({ message: 'Assessment ID, selected tab, and form data are required.' });
  }

  // Ensure the assessmentID exists
  if (!database[assessmentID]) {
    database[assessmentID] = {};
  }

  // Save the formData for the selectedTab
  database[assessmentID][selectedTab] = formData;

  console.log('Updated Database:', database); // Log the current database state
  res.status(200).json({ message: 'Data saved successfully.' });
});

// Retrieve form data
app.get('/retrieve', (req, res) => {
  const { assessmentID } = req.query;
  const data = database[assessmentID];
  if (!data) {
    return res.status(404).json({ message: 'Data not found.' });
  }
  res.status(200).json(data);
});

// Retrieve form data for a specific tab
app.get('/retrieve/:assessmentID/:selectedTab', (req, res) => {
  const { assessmentID, selectedTab } = req.params;
  const data = database[assessmentID] ? database[assessmentID][selectedTab] : null;
  if (!data) {
    return res.status(404).json({ message: 'Data not found.' });
  }
  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
