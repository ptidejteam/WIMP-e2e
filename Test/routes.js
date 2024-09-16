// routes.js
const express = require('express');
const router = express.Router();
const db = require('./database');

// Results route
router.get('/testResults', async function (req, res) {
  try {
  // Get the tc_id from the query parameters
    const { tc_id } = req.query;

    // If tc_id is not provided, return a 400 Bad Request response
    if (!tc_id) {
      return res.status(400).send('tc_id (testcase_ID) is required');
    }

   // Fetch records based on tc_id
   const records = await db.query('SELECT * FROM teststeps WHERE tc_id = ? and status=1', [tc_id]);
   // Return the records as JSON
   res.json({
     data: records,
   });
 } catch (error) {
   console.error('Error fetching records:', error);
   res.sendStatus(500);
 }
});
// Results route
router.get('/testLogs', async function (req, res) {
  try {
  // Get the tc_id from the query parameters
    const { tc_id } = req.query;

    // If tc_id is not provided, return a 400 Bad Request response
    if (!tc_id) {
      return res.status(400).send('tc_id (testcase_ID) is required');
    }

   // Fetch records based on tc_id
   const records = await db.query('SELECT * FROM testlogs WHERE tc_id = ?', [tc_id]);
   // Return the records as JSON
   res.json({
     data: records,
   });
 } catch (error) {
   console.error('Error fetching records:', error);
   res.sendStatus(500);
 }
});
module.exports = router;
