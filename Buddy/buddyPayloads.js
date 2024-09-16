const mariadb = require('mariadb')
const express = require('express')
//const router = express.Router();
//const db = require('./database');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 100000,
})
// Function to handle form submission for adding a new ent
function add(payload) {
  const parsedData = JSON.parse(payload)
  const topicName = parsedData.topicName
  if (topicName.toLowerCase() === 'buddy') {
    const receivedOn = parsedData.receivedOn
    const buddyPayload = parsedData.buddyPayload
    const buddyPayloadExecutionStatus = parsedData.buddyPayloadExecutionStatus
    const buddyPayloadExecutionOutcome = parsedData.buddyPayloadExecutionOutcome
    const triggeringEvent = parsedData.triggeringEvent

    pool
      .getConnection()
      .then((conn) => {
        conn
          .query('USE buddy_db')
          .then(
            conn.query(
              'INSERT INTO buddy_actions (uniqueID, receivedOn,buddyPayload, buddyPayloadExecutionStatus, buddyPayloadExecutionOutcome,triggeringEvent) VALUES (?,?, ?, ?, ?,?)',
              [
                uniqueID,
                receivedOn,
                buddyPayload,
                buddyPayloadExecutionStatus,
                buddyPayloadExecutionOutcome,
                triggeringEvent,
              ]
            )
          )
      })
      .catch((error) => {
        console.error('Error buddy_action data:', error)
      })
  }
}
function edit(payload) {
  const parsedData = JSON.parse(payload)
  const uniqueID = parsedData.uniqueID
  const buddyPayloadExecutionStatus = parsedData.buddyPayloadExecutionStatus
  const buddyPayloadExecutionOutcome = parsedData.buddyPayloadExecutionOutcome

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query('USE buddy_db')
        .then(
          conn.query(
            'UPDATE buddy_action SET buddyPayloadExecutionStatus=?,buddyPayloadExecutionOutcome=? WHERE uniqueID = ?',
            [
              buddyPayloadExecutionStatus,
              buddyPayloadExecutionOutcome,
              uniqueID,
            ]
          )
        )
    })
    .catch((error) => {
      console.error('Error Updating budy_action data')
    })
}

async function nextAction() {
  let connection
  let returnedAction
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db')
    returnedAction = await connection.query(
      'select *from buddy_actions where buddyPayloadExecutionStatus not like "%Completed" order by receivedOn asc limit 1'
    )
  } catch (error) {
    console.error('Error retrieving next action:', error)
  } 
  connection.end();
  return returnedAction
}
module.exports = { add, edit, nextAction }
