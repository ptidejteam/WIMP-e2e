const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 10,
});

const buddyactions = [
  { 
    receivedOn: '2024-05-01 01:30:25',
    heartRate: 104,
    buddyPayload: 'move/2.0f/0.4f&rotate/20/40',
    buddyPayloadExecutionStatus: 'NOT STARTED',
    buddyPayloadExecutionOutcome: '',
    buddyExpectedOutcome: 'SUCCESS',
    triggeringEvent: 'hr'
  }, 
];
async function createDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS buddy_db');
    console.log('Database created successfully.');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function createBuddyTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS buddy_action (
        actionId INT NOT NULL AUTO_INCREMENT,
        receivedOn DATETIME, 
        buddyPayload VARCHAR(255),
        buddyPayloadExecutionStatus VARCHAR(20),
        buddyPayloadExecutionOutcome VARCHAR(20),
        triggeringEvent VARCHAR(20),
        CONSTRAINT buddy_action_pk PRIMARY KEY (actionId)
      )
    `);
    console.log('buddy_action table created successfully.');
  } catch (error) {
    console.error('Error creating buddy_action table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function seedBuddyAction() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query('DELETE FROM buddy_action');

    for (const record of buddyactions) {    
        await connection.query('INSERT INTO buddy_action (receivedOn,buddyPayload, buddyPayloadExecutionStatus,buddyPayloadExecutionOutcome,triggeringEvent) VALUES (?, ?, ?, ?, ?)', [
        record.receivedOn,
        record.buddyPayload,
        record.buddyPayloadExecutionStatus,
        record.buddyExpectedOutcome,
        record.triggeringEvent,
      ]);
    }

    console.log('buddy_action table seeded successfully.');
  } catch (error) {
    console.error('Error seeding buddy_action table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function seedNextAction() {
  let connection;
  let returnedAction;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    returnedAction= await connection.query('select *from buddy_actions where buddyPayloadExecutionStatus not like "%Completed" order by receivedOn asc limit 1');
    console.log(`Returned action: ${JSON.stringify(returnedAction)}`);
  } catch (error) {
    console.error('Error retrieving next action:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
  return returnedAction;
}


async function seedDatabase() {
  await createDatabase();
  await createBuddyTable();
  await seedBuddyAction();
  await seedNextAction();
  pool.end();
}

seedDatabase();