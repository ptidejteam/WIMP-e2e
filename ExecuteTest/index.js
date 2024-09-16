import express from 'express';
import { MongoClient } from "mongodb";
import cors from 'cors';
import dotenv from 'dotenv';

import WebSocketReceiver from "./WebSocketReceiver.js";
import CoAPReceiver from "./CoAPReceiver.js";
import HTTPReceiver from "./HTTPReceiver.js";
import MQTTReceiver from './MQTTReceiver.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
const wsPort = 8181;

const client = new MongoClient(process.env.MONGO_URL);

let usedReceiver;

let conn;

export let newResultReceived;

//NOTE: The test message received and saving function has been moved to the "Connexion" classes in the Payload Analysis microservice ("Payload").

async function TryDatabaseConnect() {
    try {
        conn = await client.connect();
        console.log("Connected to database \"testLogDatabase\".")
    } catch (e) {
        console.error(e);
    }
}

TryDatabaseConnect();

let db = client.db(process.env.MONGO_DB);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

try {
    app.listen(port, () => console.log("Test result service is listening on port " + port));
} catch (e) {
    console.error(e);
}

//Inserts a new test result in the database.
app.post('/addtestresult', async (req, res) => {
    const { TC_ID, id, operation, target, inputs, message, actualResult, succeded } = req.body;
    const currentDate = new Date();
    const receivedOn = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + "-" + String(currentDate.getDate()).padStart(2, '0');

    const testResult = { TC_ID, _id: id, operation, target, inputs, receivedOn, message, actualResult, succeded };

    try {
        const successfulInsert = insertTestResult(testResult);
        if (successfulInsert) res.status(201).send("Test result successfully saved!");
        else res.status(500).send("Error while trying to log test result.");
    } catch (err) {
        res.status(500).send("Caught unknown error while saving test results: " + err);
    }
});

//Get the tests results from the specified date. If there are no date parameters, just get most recent.
app.get('/testresults', async (req, res) => {
    const { receivedOn } = req.body;
    const query = { $eq: { receivedOn: receivedOn } };

    try {
        if (!receivedOn || receivedOn == undefined) {
            //Get only most recent.
            await db.collection(process.env.MONGO_COLLECTION).findOne().then(function (resp) {
                if (!resp) res.status(204).send("Error. The test log is empty.");
                else res.status(200).send(resp);
            });
        } else {
            //Get test results matching date.
            const cursors = db.collection(process.env.MONGO_COLLECTION).find(query);

            if ((await cursors.toArray()).length == 0) res.status(400).send("Error. Could not find any test logs at the specified date.");
            else res.status(200).send(await cursors.toArray());
        }
    } catch (err) {
        res.status(500).send("Unknow error while getting specific test logs: " + err);
    }

});

//Sends the json through an http connection.
app.post('/sendjsonhttp', (req, res) => {

    const jsonFile = req.body.jsonFile;

    try {
        usedReceiver.sendJSON(jsonFile);
        res.status(200).send("Previous JSON updated successfully.");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong while updating the current JSON: " + err);
    }
});

app.put('/updatemethod', (req, res) => {
    const { method } = req.body;

    if (typeof (usedReceiver) == CoAPReceiver) {
        usedReceiver.updateObserver(method);
        res.status(201).send("CoAP Method got updated successfully.");
    } else res.status(500).send("Current connection is not CoAP.");
});

//Makes the receiver connection the type that is specified by the parameter in the body.
app.post('/establishreceiver', async (req, res) => {
    const { protocol, method, tc_id } = req.body;

    try {
        createConnection(protocol, method, tc_id);
        res.status(201).send("Receiver created successfully!");
    } catch (err) {
        console.log("Error message: " + err);
        res.status(500).send("A problem occured while trying to create the receiver: " + err);
    }
});

app.get('/gettestresults', async (req, res) => {
    const TC_ID = req.body.TC_ID || req.query.TC_ID;

    const query = { TC_ID: { $eq: TC_ID } };

    const cursors = db.collection(process.env.MONGO_COLLECTION).find(query);

    const tests = (await cursors.toArray())

    if (tests.length == 0) res.status(400).send("No tests found with TC_ID of " + TC_ID);
    else res.status(201).send(tests);
});

/* app.get('/gettestresults', async (req, res) => {
    const TC_ID = req.query.TC_ID; // Utilisation de req.query au lieu de req.body

    if (!TC_ID) {
        return res.status(400).send("TC_ID is required");
    }

    const query = { TC_ID: { $eq: TC_ID } };

    try {
        const cursors = db.collection(process.env.MONGO_COLLECTION).find(query);
        const tests = await cursors.toArray();

        if (tests.length === 0) {
            return res.status(404).send("No tests found with TC_ID of " + TC_ID);
        }

        res.status(200).json(tests);
    } catch (err) {
        console.error("Error fetching test results:", err);
        res.status(500).send("Server error");
    }
}); */


//Fetches and saves any new test results.
app.get('/fetchtestresults', async (req, res) => {
    try {
        const TC_ID = req.body.TC_ID || req.query.TC_ID;

        if (!usedReceiver) createConnection("Websocket", null, TC_ID);

        await usedReceiver.requestTestResults(TC_ID);

        res.status(201).send("Done fetching the test results")
    } catch (err) {
        console.log("Could not fetch test results from the IoT app. Error: " + err);
        res.status(500).send("Could not fetch: " + err);
    }

});

// Endpoint to fetch all unique TC_IDs
app.get('/getavailabletcids', async (req, res) => {
    try {
        const uniqueTC_IDs = await db.collection(process.env.MONGO_COLLECTION)
            .distinct("TC_ID");

        if (!uniqueTC_IDs || uniqueTC_IDs.length === 0) {
            res.status(404).send("No TC_IDs found.");
        } else {
            res.status(200).send(uniqueTC_IDs);
        }
    } catch (err) {
        console.error("Failed to fetch TC_IDs:", err);
        res.status(500).send("An error occurred while fetching TC_IDs.");
    }
});

//Empties the test log database, if the user wants to quickly redo the tests
app.delete('/flushresultlog', async (req, res) => {
    await db.collection(process.env.MONGO_COLLECTION).deleteMany({});
    res.status(201).send("Successfully delete DB data from result log database.");
});

app.delete('/deletesomeresults', async (req, res) => {
    const TC_ID = req.body.TC_ID
    await db.collection(process.env.MONGO_COLLECTION).deleteMany({ TC_ID: { $eq: TC_ID } });
    res.status(201).send("Successfully delete specified data from result log database.");
});

//Inserts a new test result in the db.
export async function insertTestResult(testResult) {

    try {
        await db.collection(process.env.MONGO_COLLECTION).insertOne(testResult).then((resp) => {
            return true;
        });
    } catch (err) {
        console.log("Error while inserting test results: " + err);
        return false;
    }

    return true;
}

export async function isIDUnique(id) {

    const query = { _id: { $eq: id } };

    const testResult = await db.collection(process.env.MONGO_COLLECTION).findOne(query);

    return testResult == null;
}

function createConnection(connectionName, method, tc_id) {

    //TODO: Disconnect the previous connection, if it exists.
    if (usedReceiver) usedReceiver.disconnect();

    console.log("Creating receiver " + connectionName);

    switch (connectionName) {
        case "Websocket":
            usedReceiver = new WebSocketReceiver(tc_id);
            break;
        case "CoAP":
            usedReceiver = new CoAPReceiver(tc_id);
            usedReceiver.method(method);
            break;
        case "HTTP":
            usedReceiver = new HTTPReceiver(tc_id);
            break;
        case "MQTT":
            usedReceiver = new MQTTReceiver(tc_id);
            break;
        default:
            if (!connectionName) throw "No connection name was provided.";
            else throw "The provided connection name (" + connectionName + ") does not exist.";
            break;
    }
}