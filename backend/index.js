const express = require('express');
const app = express();
const port = 4000;
const cors=require('cors');
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies
app.use(express.json());

//allowing cross-origin requests 
app.use(cors());

// Function to read data from the JSON file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
  }
};

// Function to write data to the JSON file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
};

// Initialize the data from the JSON file
let data = readDataFromFile();

//get route to check backend
app.get('/',(req,res)=>{
    res.json("Hey! I am backend and I am running nice.")
})

// GET route to fetch all data
app.get('/data', (req, res) => {
  console.log("responding with all data now");
  res.json(data);
});

// POST route to update the data
app.post('/data', (req, res) => {
  const newData = req.body.data;
  console.log(req.body)
  data = newData;
  //updating data in file so that it stays even after server restarts 
  writeDataToFile(data);
  console.log('Updated data:', data);
  res.json({ message: 'Data updated successfully' });
});

// POST route to add a new data object
app.post('/add', (req, res) => {
  const newDataObject = req.body.data;
  
  // Assigning a new ID to the new data object
  const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  newDataObject.id = newId;

  // Adding the new data object to the existing data array
  data.push(newDataObject);

  // Writing the updated data to the file
  writeDataToFile(data);

  console.log('Added new data object:', newDataObject);
  res.json({ message: 'New data object added successfully', data: newDataObject });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
