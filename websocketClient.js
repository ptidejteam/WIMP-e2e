const WebSocket = require('ws')
const buddyPayloads = require('./Buddy/buddyPayloads.js')
function connectWebSocket() {
  //const ws = new WebSocket('ws://192.168.2.11:8585')
  const ws = new WebSocket('ws://192.168.2.31:8585')

  ws.on('open', function open() {
    console.log('Connected to the server.')
    // ws.send('Ready to execute my commands');

    async function executeCode() {
      try {
        const nextPayload = await buddyPayloads.nextAction()
        // console.log(nextPayload);
        ws.send(JSON.stringify(nextPayload))
        console.log(JSON.stringify(nextPayload))
      } catch (error) {
        console.error('Error executing code:', error)
      }
    }

    // Execute immediately
    executeCode()

    // Schedule to execute every 5 minutes
    setInterval(executeCode, 30000)
  })

  ws.on('message', function incoming(data) {
    console.log(`Received from server:${data}`)
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

module.exports = connectWebSocket
