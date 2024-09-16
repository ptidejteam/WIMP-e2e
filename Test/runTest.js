const WebSocket = require('ws')
const manageTests = require('./manageTests.js')
const axios = require('axios');
function fitbitDataDeterminer(datatype){
  // Firebase database URL
const databaseURL = 'https://fitbitaction-default-rtdb.firebaseio.com/buddyAction.json';
let fitbitdata;
if(datatype=="bpm"){
  fitbitdata=true;
}
else{
  fitbitdata=false;
}
// Data to be updated
const data = {
  accelerometer: false,
  heartbeat: fitbitdata,
  location: false
};
let returnedData;
// Update the entry in the database
axios.put(databaseURL, data)
  .then(response => {
    returnedData=response.data;
    console.log('Data successfully updated:', returnedData);
  })
  .catch(error => {
    returnedData=error;
    console.error('Error updating data:', returnedData);
  });
}
function connectWebSocket() {
  //const ws = new WebSocket('ws://192.168.2.11:8585')
 // const ws = new WebSocket('ws://172.20.10.5:8585')
  //const ws = new WebSocket('ws://192.168.2.31:8585')
 // const ws = new WebSocket('ws://172.31.174.198:8585')
  //const ws = new WebSocket('ws://10.42.0.20:8585')
  const ws = new WebSocket('ws://192.168.0.144:8585')

  ws.on('open', function open() {
    console.log('Connected to the server.')
    // ws.send('Ready to execute my commands');
    console.log('INSIDE CONNECT TO WEBSOCKET ROBOT..');
    async function executeCode() {
      try {
        // console.log(nextPayload);
        let nextStep=await manageTests.nextStep();
        console.log(JSON.stringify(nextStep));
        ws.send(JSON.stringify(nextStep))
       // console.log(JSON.stringify(nextStep))
      } catch (error) {
        console.error('Error executing code:', error)
      }
    }

    // Execute immediately
    executeCode()

    // Schedule to execute every 5 minutes
   // setInterval(executeCode, 30000)
  })

  ws.on('message', function incoming(data) {
    //console.log(`Received from server:${data}`)
    let TC_Id;
    const messageFromServer = JSON.parse(data);
    const result=messageFromServer.ExecutionFeedback;
    const parsedResult=JSON.parse(result);
    const id=parsedResult.id;
    const executionStatus=parsedResult.executionStatus;
    manageTests.updateStatus(id,executionStatus);
    manageTests.getTC_ID(id).then(tc_id =>{
    const logs=messageFromServer.Logs;
    const cleanedLogs = logs.replace(/\\/g, '');
    console.log(`Parsed Logs: ${cleanedLogs}`)
    manageTests.storeLogs(tc_id,cleanedLogs); 
    console.log(`TestCase_ID:${tc_id}`);
    })
    ws.send(data)
    //ws.send("uniqueID: 3,receivedOn: 1970-01-01T05:00:00.000Z, buddyPayload: 'enablewheels',buddyPayloadExecutionStatus: 'Pending',buddyPayloadExecutionOutcome: 'PASS',triggeringEvent: 'Heart rate");
    // const nextPayload=await buddyPayloads.nextAction();
    // console.log(nextPayload);
    // ws.send(nextPayload);


  })

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err)
  })

  ws.on('close', function close() {
    console.log('Disconnected from the server.')
  })
}

module.exports = {connectWebSocket,fitbitDataDeterminer}
