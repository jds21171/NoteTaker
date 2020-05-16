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

let notesData = [];

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// routes

// api call response for all the notes, and sends the results to the browser as an array of object

app.get("/api/notes", function(err, res) {
    if (err) throw err;
    // reads the notes from json file
    notesData = fs.readFileSync("db/db.json", "utf8");

    // parse it so notesData is an array of objects
    notesData = JSON.parse(notesData);
    //   send objects to the browser
    res.json(notesData);
    console.log("/api/notes get request successful!");
});

// writes the new note to the json file
app.post("/api/notes", function(req, res) {
    // reads the json file
    notesData = fs.readFileSync("db/db.json", "utf8");
    console.log(notesData);

    // parse the data to get an array of objects
    notesData = JSON.parse(notesData);
    // Set new notes id
    req.body.id = notesData.length;
    // add the new note to the array of note objects
    notesData.push(req.body); // req.body - user input
    // make it string(stringify)so you can write it to the file
    notesData = JSON.stringify(notesData);
    // writes the new note to file
    fs.writeFile("db/db.json", notesData, "utf8", function(err) {
      // error handling
        if (err) throw err;
    });
    // changeit back to an array of objects & send it back to the browser(client)
    res.json(JSON.parse(notesData));
    console.log("/api/notes post request successful!")
});
// Delete a note

app.delete("/api/notes/:id", function(req, res) {
    //  reads the json file
    notesData = fs.readFileSync("db/db.json", "utf8");
    // parse the data to get an array of the objects
    notesData = JSON.parse(notesData);
    // delete the old note from the array on note objects
    notesData = notesData.filter(function(note) {
        return note.id != req.params.id;
    });
    // make it string(stringify)so you can write it to the file
    notesData = JSON.stringify(notesData);
    // write the new notes to the file
    fs.writeFile("db/db.json", notesData, "utf8", function(err) {
      // error handling
        if (err) throw err;
    });

    // change it back to an array of objects & send it back to the browser (client)
    res.send(JSON.parse(notesData));
    console.log("/api/notes:id delete request successful!");
});

// HTML GET Requests

// Web page when the Get started button is clicked
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
    console.log("/notes get request successful!");
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.json(__dirname, "db/db.json"));
    console.log("api/notes get request successful!");
});
  
// If no matching route is found default to home
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
    console.log("Your get request did not exist, reset url to homepage.");
});

// Start the server on the port
app.listen(PORT, function() {
    console.log("SERVER IS LISTENING: " + PORT);
});