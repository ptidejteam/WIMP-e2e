// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const session = require('express-session');
const webSocket = require('./websocket');
const connectWebSocket = require('./websocketClient');
//const payload=require('./Buddy/payloadGenerator.js');
//const WebSocket=require('ws');
const app = express();
const PORT = process.env.PORT || 3000;
const websocketPort=8080;
connectWebSocket();
//Create a Websocket server completely detached from the HTTP Server
/*const wss=new WebSocket.Server({port:8181});
const wsSelected=new Set();
wss.on('connection', function connection(ws){
  wsSelected.add(ws);
  console.log('Client Connecting....');
  ws.on('message', function incoming(message){
    wsSelected.forEach(function each(client) {
      console.log(client.readyState);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // process the message to know whether it comes from fitbit or buddy
        // Message that comes from fitbit, triggers some actions on the buddy. WIMP should send the payload to Buddy for Execution.
        // Message that comes from buddy, contains the execution status. WIMP should update the execution status of the given payload.
        // Message that comes from buddy can also be the log of execution. WIMP should store this log information.
        buddyPayloads.add(message);
        client.send(`Echo:${message}`);
      }
    })
    console.log('received:%s',message);
    //echo the message back to the client
    ws.send(`Echo: ${message}`);
  });
  });*/
//console.log(payload());
//webSocket(8080);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }));
  
  // Set up middleware to parse request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());



app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});