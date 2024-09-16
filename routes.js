// routes.js

const express = require('express');
const router = express.Router();
const db = require('./database');
const bcrypt = require('bcrypt');

// Login route
router.get('/login1', (req, res) => {
    res.render('login1');
  });
// Login route
router.post('/login1', async (req, res) => {
    const { userEmail, userPassword } = req.body;
  
    try {
      // Check if the user exists in the database
      const results = await db.query('SELECT * FROM users WHERE userEmail = ?', [userEmail]);
  
      if (results.length === 0) {
        // User not found
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = results[0];
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
  
      if (!passwordMatch) {
        // Passwords don't match
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Password is correct, create a session for the user
      req.session.userId = user.userUniqueId;
      req.session.userName = user.userName;
  
      //res.json({ message: 'Login successful' });
      return res.redirect('/');
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



// Home route
router.get('/users', async function (req, res) {
    try {
      // Check if the user is logged in
      if (!req.session.userId) {
        // User is not logged in, redirect to the login page
        return res.redirect('/login1');
      }
  
      const users = await db.query('SELECT * FROM users');
  
      res.render('admin', {
        data: users,
        userName: req.session.userName,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.sendStatus(500);
    }
  });

// Add user route
router.post('/user/add', async (req, res) => {
  const { userName, userEmail, userAge, userUniqueId } = req.body;

  try {
    await db.query('INSERT INTO users (userUniqueId, userName, userEmail, userAge) VALUES (?, ?, ?, ?)', [
      userUniqueId,
      userName,
      userEmail,
      userAge,
    ]);
    res.redirect('/users');
  } catch (error) {
    console.error('Error adding user:', error);
    res.sendStatus(500);
  }
});

// Delete user route
router.delete('/user/delete/:userUniqueId', async (req, res) => {
  const userUniqueId = req.params.userUniqueId;

  try {
    await db.query('DELETE FROM users WHERE userUniqueId = ?', [userUniqueId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.sendStatus(500);
  }
});

// Update user route
router.put('/user/update/:userUniqueId', async (req, res) => {
  const { userName, userEmail, userAge } = req.body;
  const userUniqueId = req.params.userUniqueId;

  try {
    await db.query('UPDATE users SET userName = ?, userEmail = ?, userAge = ? WHERE userUniqueId = ?', [
      userName,
      userEmail,
      userAge,
      userUniqueId,
    ]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating user:', error);
    res.sendStatus(500);
  }
});

// Home route
router.get('/', async function (req, res) {
  try {
    // Check if the user is logged in
    if (!req.session.userId) {
      // User is not logged in, redirect to the login page
      return res.redirect('/login1');
    }

    const wimps = await db.query('SELECT * FROM users');

    res.render('admin', {
      data: wimps,
      userName: req.session.userName,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.sendStatus(500);
  }
});

// ======================WIMP ENTRIES ====================================
// wimp route
router.get('/wimps', async function (req, res) {
  try {
    // Check if the user is logged in
    if (!req.session.userId) {
      // User is not logged in, redirect to the login page
      return res.redirect('/login1');
    }

    const wimps = await db.query('SELECT * FROM wimps');

    res.render('home', {
      data: wimps,
    });
  } catch (error) {
    console.error('Error fetching wimp entry:', error);
    res.sendStatus(500);
  }
});
router.get('/wimpsJson', async function (req, res) {
  try {
    // Check if the user is logged in
    //if (!req.session.userId) {
      // User is not logged in, redirect to the login page
     // return res.redirect('/login1');
    //}

    const wimps = await db.query('SELECT * FROM wimps');

   // Set the Content-Type header to application/json
   res.setHeader('Content-Type', 'application/json');
  // Send wimps data as JSON
  res.json({
    data: wimps,
  });
} catch (error) {
  console.error('Error fetching wimp entry:', error);
  res.sendStatus(500);
}
});
// Add wimp route
router.post('/wimp/add', async (req, res) => {
  console.log('into wimp/add');
const { uniqueID,heartbeat,receivedOn,buddyPayload,buddyPayloadExecutionStatus,notificationMessage,notificationDeliveryStatus } = req.body;
try {
  await db.query('INSERT INTO wimps (uniqueID,heartbeat, receivedOn,buddyPayload, buddyPayloadExecutionStatus, notificationMessage,notificationDeliveryStatus) VALUES (?,?, ?, ?, ?,?,?)', [
  uniqueID,
  heartbeat,
  receivedOn,
  buddyPayload,
  buddyPayloadExecutionStatus,
  notificationMessage,
  notificationDeliveryStatus,
  ]);
  res.redirect('/wimps');
} catch (error) {
  console.error('Error adding wimp entry:', error);
  res.sendStatus(500);
}
});

// Delete wimp route
router.delete('/wimp/delete/:uniqueID', async (req, res) => {
const uniqueID = req.params.uniqueID;

try {
  await db.query('DELETE FROM wimps WHERE uniqueID = ?', [uniqueID]);
  res.sendStatus(200);
} catch (error) {
  console.error('Error deleting wimp entry:', error);
  res.sendStatus(500);
}
});

// Update wimp route
router.put('/wimp/update/:uniqueID', async (req, res) => {
console.log('into wimp/update');
const { heartbeat,receivedOn,buddyPayload,buddyPayloadExecutionStatus,notificationMessage,notificationDeliveryStatus } = req.body;
const uniqueID = req.params.uniqueID;
console.log(uniqueID);
try {
  await db.query('UPDATE wimps SET heartbeat = ?, receivedOn = ?, buddyPayload = ?,buddyPayloadExecutionStatus=?,notificationMessage=?,notificationDeliveryStatus=? WHERE uniqueID = ?', [
    heartbeat,
    receivedOn,
    buddyPayload,
    buddyPayloadExecutionStatus,
    notificationMessage,
    notificationDeliveryStatus,
    uniqueID,
  ]);
  res.sendStatus(200);
} catch (error) {
  console.error('Error updating wimp entry:', error);
  res.sendStatus(500);
}
});

// fitbit routes
// fitbit HR listing
router.get('/fitbit_hr',async (req, res) => {
  try {
    const fitbit_hr = await db.query('SELECT * FROM fitbit_hr');
  
     // Set the Content-Type header to application/json
     res.setHeader('Content-Type', 'application/json');
    // Send wimps data as JSON
    res.json({
      data: fitbit_hr,
    });
  } catch (error) {
    console.error('Error fetching fitbit_hr entry:', error);
    res.sendStatus(500);
  }
    
  });
// fitbit HR Add
router.post('/fitbit_hr/add', async (req, res) => {
    const {clientId,timestamp,heartRate} = req.body;
    try {
      await db.query('INSERT INTO fitbit_hr (clientId, timestamp, heartRate) VALUES (?, ?, ?)', [
        clientId,
        timestamp,
        heartRate,
      ]);
    } catch (error) {
      res.sendStatus(500);
    }
}); 
    
// Delete fitbit HR reading
router.delete('/fitbit_hr/delete/:readingUniqueId', async (req, res) => {
  const readingUniqueId = req.params.readingUniqueId;
  
  try {
    await db.query('DELETE FROM fitbit_hr WHERE readingUniqueId = ?', [readingUniqueId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting fitbit_hr entry:', error);
    res.sendStatus(500);
  }
  });


// Fitbit loc listing
router.get('/fitbit_loc', async function (req, res) {
  try {
    const fitbit_location = await db.query('SELECT * FROM fitbit_location');
  
     // Set the Content-Type header to application/json
     res.setHeader('Content-Type', 'application/json');
    // Send fitbit loc data as JSON
    res.json({
      data: fitbit_location,
    });
  } catch (error) {
    console.error('Error fetching fitbit_location entry:', error);
    res.sendStatus(500);
  }
  });

// Add fitbit loc
router.post('/fitbit_loc/add', async (req, res) => {
  const {clientId,latitude,longitude,timestamp} = req.body;

  try {
    await db.query('INSERT INTO fitbit_location (clientId, latitude,longitude, timestamp) VALUES (?, ?, ?,?)', [
      clientId,
      latitude,
      longitude,
      timestamp,
    ]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.sendStatus(500);
  }
});
// Delete fitbit loc entry
router.delete('/fitbit_loc/delete/:readingUniqueId', async (req, res) => {
  const readingUniqueId = req.params.readingUniqueId;
  
  try {
    await db.query('DELETE FROM fitbit_location WHERE readingUniqueId = ?', [readingUniqueId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting fitbit_location:', error);
    res.sendStatus(500);
  }
  });

  // Listing fitbit accelerometers
router.get('/fitbit_acc', async function (req, res) {
  try {
  const fitbit_accelerometer = await db.query('SELECT * FROM fitbit_accelerometer');

   // Set the Content-Type header to application/json
   res.setHeader('Content-Type', 'application/json');
  // Send fitbit accelorometer data as JSON
  res.json({
    data: fitbit_accelerometer,
  });
} catch (error) {
  console.error('Error fetching fitbit_accelerometer entry:', error);
  res.sendStatus(500);
}
});

// Add fitbit accelorometer
router.post('/fitbit_acc/add', async (req, res) => {
const {clientId,accX,accY,accZ,timestamp} = req.body;
try {
  await db.query('INSERT INTO fitbit_accelerometer (clientId, accX,accY,accZ, timestamp) VALUES (?, ?, ?,?,?)', [
    clientId,
    accX,
    accY,
    accZ,
    timestamp,
  ]);
} catch (error) {
  console.error('Error adding user:', error);
  res.sendStatus(500);
}
});

//Delete fitbit accelerometer
router.delete('/fitbit_acc/delete/:readingUniqueId', async (req, res) => {
  const readingUniqueId = req.params.readingUniqueId;

  try {
    await db.query('DELETE FROM fitbit_accelerometer WHERE readingUniqueId = ?', [readingUniqueId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting fitbit_accelerometer:', error);
    res.sendStatus(500);
  }
});

module.exports = router;