const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const connectDatabase = require(".//databaseEvents/dbConnection");
const mongoose = require("mongoose");
const User = require('.//databaseEvents/userSchema');
const socketEvents = require('./socketio');



// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

//socket.on "client to server", io.on "server to client" 

socketEvents(io);

connectDatabase();


server.listen(3000, () => {
  console.log('listening on *:3000');
});