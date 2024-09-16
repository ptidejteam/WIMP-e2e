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
function getFormatedTimeStamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JS
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTimestamp;
  
}
function add(message) {
  let tc_id,tc_name;
  const testCases = JSON.parse(message);
  console.log(`Received message: ${testCases}`);
  tc_id=testCases.TC_ID;
  console.log(`T_ID:${tc_id}`);
  tc_name=testCases.name;
  console.log(`Name:${tc_name}`);
  const testCasesSteps=testCases.steps;
  console.log(`steps::${testCasesSteps}`);
  testCasesSteps.forEach((step, index) => {
    let stepOp,stepTarget,stepInputs,stepExpectations,stepNo;
  stepNo=index+1;
  stepOp=step.operation;
  console.log(`Operation:${stepOp}`);
  if(step.target!=null){
  stepTarget=JSON.stringify(step.target);
  console.log(`Target:${stepTarget}`);
  }
  else{
    stepTarget=""; 
  }
  if(step.inputs!=null){
  stepInputs=step.inputs; 
  console.log(`Inputs:${JSON.stringify(stepInputs)}`);
  }
  else{
    stepInputs={}; 
  }
  if(step.expectations!=null){
  stepExpectations=step.expectations;
  console.log(`Expectations:${JSON.stringify(stepExpectations)}`);
  }
  else{
    stepExpectations={}; 
  }
 

    pool
      .getConnection()
      .then((conn) => {
        conn
          .query('USE wimp_test')
          .then(
            conn.query(
              'INSERT IGNORE INTO testcases (TC_ID, name,timestamp) VALUES (?,?,?)',
              [
                tc_id,
                tc_name,
                getFormatedTimeStamp(),
              ]
            )
          ).then(
            conn.query(
              'INSERT INTO teststeps (TC_ID, target,operation,inputs,expectations,stepNo) VALUES (?,?,?,?,?,?)',
              [
                tc_id,
                stepTarget,
                stepOp,
                stepInputs,
                stepExpectations,
                stepNo,
              ]
            )

          )
      })
      .catch((error) => {
        console.error('Error saving test case data:', error)
      })
    });
}
function updateStatus(id,executionFeedback) {
 
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query('USE wimp_test')
          .then(
            conn.query(
              'update teststeps set actualResult=?,status=? where id=?',
              [
                executionFeedback,
                1,
                id,
              ]
            )
          )
      })
      .catch((error) => {
        console.error('Error while updating execution status:', error)
      })
    }
    function storeLogs(tc_id,logs) {
     console.log(`MESSAGE TO BE INSERTED ${logs}`);
      pool
        .getConnection()
        .then((conn) => {
          conn
            .query('USE wimp_test')
            .then(
              conn.query(
                'insert into testLogs(tc_id,logs) values (?,?)',[tc_id,logs]
                
              )
            )
        })
        .catch((error) => {
          console.error('Error while storing logs:', error)
        })
      }
async function nextStep() {
  let connection
  let returnedAction
  try {
    connection = await pool.getConnection();
    await connection.query('USE wimp_test')
    returnedStep = await connection.query(
      'select *from teststeps where status=0 order by id asc limit 1'
    )
  } catch (error) {
    console.error('Error retrieving next step:', error)
  } 
  connection.end();
  return returnedStep
}
async function getTC_ID(id){
  let connection;
  let returnedTC_ID;

  try {
    connection = await pool.getConnection();
    await connection.query('USE wimp_test');
    const result = await connection.query('select tc_id from teststeps where id=?', [id]);
    returnedTC_ID = result.length > 0 ? result[0].tc_id : null;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release(); // Ensure the connection is released
    }
  }

  return returnedTC_ID;
}

module.exports = {add,nextStep,updateStatus,storeLogs,getTC_ID}
