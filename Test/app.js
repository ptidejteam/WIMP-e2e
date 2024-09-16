const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const WebSocket = require('ws');
const manageTests = require('./manageTests.js')
const runTests = require('./runTest.js')
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;


const wss = new WebSocket.Server({ port: 8484 });
let fbMessage;
wss.on('connection', ws => {
    console.log('New client connected');
  
    ws.on('message', message => {   
      manageTests.add(message);
      runTests.fitbitDataDeterminer("bpm");
      runTests.connectWebSocket();
      console.log(`Received Test:${message}`)
      ws.send(`Server received your message: ${message}`);
    });
    ws.send("Received Successfully");
   // https://medium.com/@vitaliykorzenkoua/working-with-websocket-in-node-js-using-typescript-1aebb8a06bd6
    ws.on('close', () => {
      console.log('Client disconnected');
    });
    ws.on('error',()=>{
        console.log('Connection error');
    });
  });
  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
    // Set up middleware to parse request bodies
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});