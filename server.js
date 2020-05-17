// Adding express
const express = require("express");
// Adding path
const path = require("path");
// Adding fs
const fs = require("fs");

// creating the express server
const app = express();
// Setting Initial port for listeners
const PORT = process.env.PORT || 8080;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// routes

// api call response for all the notes, and sends the results to the browser as an array of object
// Returns notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
    console.log("GET request for /notes was successful.");
  });
  
  // Reads db.json and returns all saves notes
  app.get('/api/notes', function (req, res) {
    fs.readFile('db/db.json', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      console.log("GET request for /api/notes was successful.");
      return res.json(notes);
    });
  });
  
  // Receives new note to save on the request body
  app.post('/api/notes', (req, res) => {
    let newNote = req.body;
  
    // Reads db.json to obtain data and make changes
    fs.readFile('db/db.json', (err, data) => {
      if (err) throw err;
      let savedNotes = JSON.parse(data);
  
      // Adds new note to saved notes data
      savedNotes.push(newNote);
  
      // Sets saved notes to string so we can write file with data
      savedNotes = JSON.stringify(savedNotes);
  
      // Rewrites database file with saved notes
      fs.writeFile('db/db.json', savedNotes, (err) => {
        if (err) throw err;
  
        console.log("POST request for /api/notes was successful.");
      });
    });
    return res.json(newNote);
  });
  
  // Deleting chosen note from database
  app.delete('/api/notes/:id', (req, res) => {
    let chosen = req.params.id;
  
    // Reading the db.json file to compare chosen parameter with data
    fs.readFile('db/db.json', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
  
      // Filters through notes in database and creates new array with notes not equal to the url parameter
      let updatedNotes = notes.filter((note) => note.id != chosen);
  
      updatedNotes = JSON.stringify(updatedNotes);
  
      fs.writeFile('db/db.json', updatedNotes, (err) => {
        if (err) throw err;
  
        console.log("DELETE request for /api/notes/:id was successful.");
      });
    });
  
    res.end();
  });
  
  // Returns home page for * as well as any other url not specified in here
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
    console.log("GET request for home page was successful.");
  });
  
  // Server begins listening
  app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });