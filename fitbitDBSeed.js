const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 10,
});

const fitbits = [
  { 
    clientId: '-',
    timestamp: '2024-05-01 01:30:25',
    heartRate: 170,
  }, 
];
const fitbitAccelerometerData = [
  { 
    clientId: '-',
    timestamp: '2024-05-01 01:30:25',
    accX: 2.6049699783325195,
    accY: -6.225113868713379,
    accZ: 7.642524719238281,
  }, 
];
const fitbitLocationData = [
  { 
    clientId: '-',
    timestamp: '2024-05-01 01:30:25',
    latitude: 45.462203333333335,
    longitude: -73.54410166666666,
  }, 
];
async function createDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS fitbit_db');
    console.log('Database created successfully.');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function createFitbitHRTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE fitbit_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fitbit_hr (
        readingUniqueId INT NOT NULL AUTO_INCREMENT,
        clientId VARCHAR(8),
        timestamp DATETIME,
        heartRate INT,
        CONSTRAINT fitbithr_pk PRIMARY KEY (readingUniqueId)

      )
    `);
    console.log('fitbit_hr table created successfully.');
  } catch (error) {
    console.error('Error creating fitbit_hr table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function createFitbitACCTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE fitbit_db');
    await connection.query(`
    CREATE TABLE IF NOT EXISTS fitbit_accelerometer (
      readingUniqueId INT NOT NULL AUTO_INCREMENT,
      clientId VARCHAR(8),
      accX double,
      accY double,
      accZ double,
      timestamp DATETIME,
      CONSTRAINT AccelerometerData_pk PRIMARY KEY (readingUniqueId)
    )
  `);
  console.log('fitbit_accelerometer table created successfully.');
} catch (error) {
  console.error('Error creating fitbit_accelerometer table:', error);
} finally {
  if (connection) {
    connection.release();
  }
}
}

async function createLocationTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE fitbit_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fitbit_location (
        readingUniqueId INT NOT NULL AUTO_INCREMENT,
        clientId VARCHAR(8),
        latitude double,
        longitude double,
        timestamp DATETIME,
        CONSTRAINT locationData_pk PRIMARY KEY (readingUniqueId)
      )
    `);
    console.log('fitbit_location table created successfully.');
  } catch (error) {
    console.error('Error creating fitbit_location table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function seedFitbitHRDB() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE fitbit_db');
    await connection.query('DELETE FROM fitbit_hr');

    for (const record of fitbits) {
      await connection.query('INSERT INTO fitbit_hr (clientId,timestamp,heartRate) VALUES (?,?,?)', [
        record.clientId,
        record.timestamp,
        record.heartRate
      ]);
    }

    console.log('fitbit_hr table seeded successfully.');
  } catch (error) {
    console.error('Error seeding fitbit_hr table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function seedFitbitACCDB() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE fitbit_db');
    await connection.query('DELETE FROM fitbit_accelerometer');

    for (const record of fitbitAccelerometerData) {
      await connection.query('INSERT INTO fitbit_accelerometer (clientId, accX, accY,accZ,timestamp) VALUES (?,?,?,?,?)', [
        record.clientId,
        record.accX,
        record.accY,
        record.accZ,
        record.timestamp
      ]);
    }
    console.log('fitbit_accelerometer table seeded successfully.');
  } catch (error) {
    console.error('Error seeding fitbit_accelerometer table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function seedFitbitLocation() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE fitbit_db');
    await connection.query('DELETE FROM fitbit_location');

    for (const record of fitbitLocationData) {
      await connection.query('INSERT INTO fitbit_location (clientId, latitude, longitude,timestamp) VALUES (?,?,?,?)', [
        record.clientId,
        record.latitude,
        record.longitude,
        record.timestamp
      ]);
    }
    console.log('fitbit_location table seeded successfully.');
  } catch (error) {
    console.error('Error seeding fitbit_location table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


async function seedDatabase() {
  await createDatabase();
  await createFitbitHRTable();
  await createFitbitACCTable();
  await createLocationTable();
  await seedFitbitLocation();
  await seedFitbitACCDB();
  await seedFitbitHRDB();
  pool.end();
}

seedDatabase();