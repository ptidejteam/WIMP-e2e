const mariadb = require('mariadb');
const express = require('express');
const payload= require('../Buddy/payloadGenerator.js');
//const router = express.Router();
//const db = require('./database');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 100000,
});
let buddyPayload;
function add(fitbitEvent) {
    
    const parsedData=JSON.parse(fitbitEvent);
    const topicName=parsedData.topicName;
    if (topicName.toLowerCase() === "heartrate") {
      const clientId = parsedData.deviceName;
      const heartRate = parsedData.heartRate;
      const timestamp = parsedData.timestamp;
     
        pool.getConnection()
        .then(conn =>{
          conn.query('USE wearable_db')
             .then(conn.query('INSERT INTO fitbit_data (clientId, timestamp, heartRate) VALUES (?, ?, ?)', [
              clientId,
              timestamp,
              heartRate,
            ]))})
            .catch (error => {
            console.error('Error adding versa-2 data:', error);
            
          });
    }
    if (topicName.toLowerCase() === 'accelerometer') {
      const clientId = parsedData.deviceName;
      const accX = parsedData.accelerometerData.x;
      const accY = parsedData.accelerometerData.y;
      const accZ = parsedData.accelerometerData.z;
      const timestamp = parsedData.timestamp;
        pool.getConnection()
        .then(conn =>{
          conn.query('USE wearable_db')
             .then(conn.query('INSERT INTO fitbit_accelerometer (clientId, accX,accY,accZ, timestamp) VALUES (?, ?, ?,?,?)', [
              clientId,
              accX,
              accY,
              accZ,
              timestamp,
            ]))})
            .catch (error => {
            console.error('Error adding versa data:', error);
            
          });
    }
    if (topicName.toLowerCase() === 'location') {
      const clientId = parsedData.deviceName;
      const latitude = parsedData.latitude;
      const longitude = parsedData.longitude;
      const timestamp = parsedData.timestamp;
        pool.getConnection()
        .then(conn =>{
          conn.query('USE wearable_db')
             .then(conn.query('INSERT INTO fitbit_location (clientId, latitude,longitude, timestamp) VALUES (?, ?, ?,?)', [
              clientId,
              latitude,
              longitude,
              timestamp,
            ]))})
            .catch (error => {
            console.error('Error adding versa data:', error);
            
          });
    }
    buddyPayload=payload();
    console.log(`Payload function:${JSON.stringify(buddyPayload)}`);
    return buddyPayload;
}
module.exports=add;