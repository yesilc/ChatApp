const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const connectDatabase = require(".//databaseEvents/dbConnection");
const mongoose = require("mongoose");
const User = require('.//databaseEvents/userSchema');
const socketEvents = require('./socketio');
const cors = require("cors")


const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

socketEvents(io);

// app.get('/', (req,res) =>{
  
// })


connectDatabase();


server.listen(3001, () => {
  console.log('listening on *:3001');
});