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