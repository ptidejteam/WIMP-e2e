// websocket function
const WebSocket=require('ws');
const buddyPayloads=require('./Buddy/buddyPayloads.js');
const addFitbit=require('./Fitbit/fitbitEvents.js');


function setupWebSocket(server) {
//Create a Websocket server completely detached from the HTTP Server
const wss=new WebSocket.Server({port:server});
console.log('Here we are....');
const wsSelected=new Set();
wss.on('connection', function connection(ws){
  wsSelected.add(ws);
  console.log('Client Connecting....');
  ws.on('message', async function incoming(message){
    wsSelected.forEach(async function each(client) {
      console.log(client.readyState);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // process the message to know whether it comes from fitbit or buddy
        // Message that comes from fitbit, triggers some actions on the buddy. WIMP should send the payload to Buddy for Execution.
        // Message that comes from buddy, contains the execution status. WIMP should update the execution status of the given payload.
        // Message that comes from buddy can also be the log of execution. WIMP should store this log information.
        addFitbit(message);
       client.send(`Echo:${message}`);
      
      }
    })
    
  
  
   console.log('received:%s',message);
    //echo the message back to the client
    //ws.send(nextPayload);
  });
  });
  console.log(`WebSocket server is set up at the port ${server}`);
}
module.exports=setupWebSocket;