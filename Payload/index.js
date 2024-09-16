import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

import { WebSocketConnexion } from './WebSocketConnexion.js';
import { CoAPConnexion } from './CoAPConnexion.js';
import { HTTPConnexion } from './HTTPConnexion.js';
import { MQTTConnexion } from './MQTTConnexion.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const wsPort = 8181;

const client = new MongoClient(process.env.MONGO_URL);

let usedConnection;

let conn;

const actionList = ["move", "rotate", "mood", "yes_move", "no_move", "enable_yes", "enable_no", "enable_wheels", "speak", "LED", "getdata", "determinebuddy", "determinefitbit"];
const expressionList = ["NONE", "NEUTRAL", "GRUMPY", "HAPPY", "ANGRY", "LISTENING", "LOVE", "SAD", "SCARED", "SICK", "SURPRISED", "THINKING", "TIRED"];
const speakExpressList = ["SPEAK_ANGRY", "NO FACE", "SPEAK HAPPY", "SPEAK NEUTRAL"]

async function TryDatabaseConnect() {
    try {
        conn = await client.connect();
        console.log("Connected to the database \"historyDatabse\".");
    } catch (e) {
        console.error(e);
    }
}

TryDatabaseConnect();

let db = client.db(process.env.MONGO_DB);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));

try {
    app.listen(port, () => console.log("Payload analysis service is listening on port " + port));
} catch (e) {
    console.error(e);
}

//Get Payload history.
app.get('/gethistory', async (req, res) => {

    try {
        const cursors = await db.collection(process.env.MONGO_COLLECTION).find({});
        if ((await cursors.toArray())?.length == 0) {
            res.status(204).send("No payload history has been saved yet.");
        } else {
            res.status(200).send(cursors.toArray());
        }
    } catch (err) {
        res.status(500).send("Caught unknown error while getting history: " + err);
    }
});

//Get a certain payload history, based on specified criterias.
app.get('/getspecifichistory', async (req, res) => {
    const { TC_ID, date } = req.body;
    query = { $or: [{ TC_ID: { $eq: TC_ID } }, { date: { $eq: date } }] };

    try {
        await db.collection(process.env.MONGO_COLLECTION).findOne(query).then(function (resp) {
            if (!resp) {
                res.status(204).send("No payload history has been found with these criterias.");
            } else {
                res.status(200).send(resp);
            }
        });
    } catch (err) {
        res.status(500).send("Caught unknown error: " + err);
    }
});

//Analyses the payload.
//TODO: replace all this code (and possibly related methods with)
app.post('/payload', async (req, res) => {
    const jsonContent = req.body.jsonContent;
    let jsonPayload;

    try {
        jsonPayload = JSON.parse(jsonContent);
    } catch (err) {
        console.log("Error in parsing.")
        res.status(400).send("Error obtained while parsing JSON: " + err);
    }

    let completedPayload = false;
    let lastProtocol = "";
    let lastMethod = "";

    usedConnection = undefined;

    const jsonArray = jsonPayload["steps"];

    console.log("Starting analysis of payload \"" + jsonPayload["name"] + "\".");

    const TCID = jsonPayload["TC_ID"];

    if (await isIDUnique(TCID)) {
        for (let i = 0; i < jsonArray.length; i++) {
            const operation = jsonArray[i].operation, inputs = jsonArray[i].inputs;
            const target = jsonArray[i].target;
            let targetName;

            if (target) targetName = target.name;

            if (operation) {
                try {

                    //Confirm that the action is one that is allowed, and that the given parameters are correct.
                    //If this is not the case, throw an error, and send a message saying that the payload is incorrect.
                    const actionError = confirmPayloadAction(operation);
                    const dataError = confirmActionData(inputs, operation, targetName);

                    if (actionError !== "" || dataError !== "") {
                        const extraError = (actionError !== "") ? "Error with the operation: " + actionError : "Error with the inputs: " + dataError;
                        throw "An error happened during the analysis. \n" + extraError;
                    }

                    if (target && usedConnection === undefined) {
                        console.log(createConnection(target.protocol, target.method));
                        lastProtocol = target.protocol;
                        lastMethod = target.method;
                    }
                    completedPayload = true;

                } catch (err) {
                    completedPayload = false;
                    res.status(500).send(err);
                    break;
                }
            } else {
                completedPayload = false;
                res.status(400).send("No payload action was given for payload #" + i + ".");
                break;
            }
        }
    } else {
        res.status(400).send("The Payload ID (" + TCID + ") is not unique.");
    }


    if (completedPayload) {

        //Saving the payloads.
        axios.post("http://localhost:3006/savepayload", {
            jsonArray: jsonArray,
            TC_ID: TCID
        }).then((resp) => {
            console.log("Added payloads successfully.")
        });

        //Add the expections in the ExecuteTest service.
        axios.post("http://localhost:3006/establishreceiver", {
            protocol: lastProtocol,
            method: lastMethod,
            tc_id: TCID
        }).then((resp) => {
            console.log(resp.data);
            res.status(201).send("Payload is correct and can be sent.");
        }).catch((err) => {
            console.warn("Something went wrong to create the receiver. Maybe the ExecuteTest service is not open. (Error: " + err + ")");
            res.status(500).send("An error has occured. Error: " + err);
        });
    }
});

//Save the payload that was used for testing.
app.post('/savepayload', async (req, res) => {

    const { jsonArray, TC_ID } = req.body;
    const currentDate = new Date();
    const date = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + "-" + String(currentDate.getDate()).padStart(2, '0');

    const errorHappened = false;

    for (let i = 0; i < jsonArray.length; i++) {
        const name = jsonArray[i].operation;
        const payloadHistory = { TC_ID, name, date, status: 0 };
        try {
            await db.collection(process.env.MONGO_COLLECTION).insertOne(payloadHistory).then((resp) => {
                if (!resp) console.log("Did not get a response from the history databse.");
                else console.log("Added payload " + name + " to history database");
            });

        } catch (err) {
            res.status(500).send("Caught error while saving : " + err);
            errorHappened = true;
            break;
        }
    }

    if(!errorHappened) res.status(201).send("Successfully added payloads to history.");
});

app.put('/modifystatus', async (req, res) => {
    const { name, status } = req.body;

    const filter = { name: {$eq: name} }
    const update = { $set: { status: status } };

    try{
        await db.collection(process.env.MONGO_COLLECTION).updateOne(filter, update).then(function(resp) {
            if (!resp) res.status(500).send("Error. Something went wrong with the server.");
            else res.status(201).send("Modified payload " + name + " status to " + status + ".");
        });
    }catch(err) {
        res.status(500).send("Caught error while updating status. Error: " + err);
    }
});

//Makes the sender connection the type that is specified by the parameter in the body.
app.post('/establishsender', (req, res) => {
    const { protocol, method } = req.body;
    try {
        createConnection(protocol, method);
        res.status(201).send("Connexion created successfully!");
    } catch (err) {
        res.status(500).send("An error occured while establishing the connection: " + err);
    }
});

//Send test/json to WIMP.
app.post('/execpayload', async (req, res) => {
    const { jsonFile } = req.body;

    //If no connections has been made yet, use WebSocket as the default.
    if (!usedConnection) createConnection("Websocket", undefined);

    if(typeof usedConnection == HTTPConnexion) {
        axios.post("http://localhost:3006/sendjsonhttp", {
            jsonFile: jsonFile
        }).then((resp) => {
            res.status(201).send("Json sent successfully.");
        }).catch((err) => {
            console.warn("An error occured while sending the payload through an HTTP connection: " + err);
            res.status(500).send("An error occured while sending the payload through HTTP: " + err);
        });
    } else {
        try{
            usedConnection.sendJson(jsonFile);
            res.status(201).send("Sent following message to server: " + jsonFile);
        } catch(err) {
            console.warn("An error occured while trying to send the payload: " + err);
            res.status(500).send("An error happned when trying to send the Json: " + err);
        }
    } 
});

app.delete('/flushhistory', async (req, res) => {
    await db.collection(process.env.MONGO_COLLECTION).deleteMany({});
    res.status(201).send("Successfully delete DB data from history database.");
});

app.delete('/deletesomehistory', async (req, res) => {
    const TC_ID = req.body.TC_ID;
    await db.collection(process.env.MONGO_COLLECTION).deleteMany({TC_ID: {$eq: TC_ID}});
    res.status(201).send("Successfully delete specified data from result log database.");
});

async function isIDUnique(uniqueID) {
    const query = { TC_ID: { $eq: uniqueID } };
    let isUnique = false;
    try {
        await db.collection(process.env.MONGO_COLLECTION).findOne(query).then(function (resp) {
            if (!resp) {
                isUnique = true;
            }
        });
    } catch (err) {
        console.error("An error happened with the Database while confirming payload ID: " + err);
    }
    return isUnique;
}

function confirmPayloadAction(buddyPayload) {
    let isAllowedAction = false;

    for (let i = 0; i < actionList?.length && !isAllowedAction; i++) {
        isAllowedAction = actionList[i].includes(buddyPayload.toLowerCase());
    }

    if (isAllowedAction) return "";
    else return "The given operation name \"" + buddyPayload + "\" is not a valid operation.";
}

function confirmActionData(actionDatas, actionType, targetName) {

    switch (targetName) {
        case "Fitbit":
            return confirmFitbitAction(actionDatas, actionType);
            break;
        case "Buddy":
            return confirmBuddyAction(actionDatas, actionType);
            break;
        default:
            //Neutral and actions not specific to a certain tool.
            return confirmNeutralAction(actionDatas, actionType);
    }
}

function confirmFitbitAction(actionDatas, actionType) {

    try {

        switch (actionType.toLowerCase()) {
            case "getdata":
                break;
            default:
                return "The action type (\"" + actionType + "\") is not an allowed type for Fitbit.";
                break;
        }

    } catch (err) {
        console.log("The fitbit data in the payload is not correct. Error: " + err);
        return err;
    }

    return "";
}

function confirmNeutralAction(actionDatas, actionType) {
    try {

        switch (actionType.toLowerCase()) {
            case "determinebuddy":
            case "determinefitbit":
                const data = parseInt(actionDatas.data);

                if (data == undefined) throw "Data used for determining next action is missing."
                if (isNaN(data)) throw "Given data for determination is not a number.";
                break;
            default:
                throw "The action type (\"" + actionType + "\") is not an allowed type for actions not related to a certain tool.";
                break;
        }

    } catch (err) {
        console.log("The data in the payload for a neutral action is not correct. Error: " + err);
        return err;
    }

    return "";
}

function confirmBuddyAction(actionDatas, actionType) {
    try {
        //TODO: See User Guide for any available or missing actions that need to be implementted.
        switch (actionType.toLowerCase()) {
            case 'move':
                const distance = parseFloat(actionDatas.distance);
                const speedM = parseFloat(actionDatas.speed);

                if (speedM == undefined) throw "Movement speed is missing.";
                if (isNaN(speedM)) throw "Movement speed is not a number.";
                if (distance == undefined) throw "Distance movement is missing.";
                if (isNaN(distance)) throw "Distance movement is not a number."
                break;
            case 'rotate':
                const speedR = parseFloat(actionDatas.speed);
                const angle = parseFloat(actionDatas.angle);

                if (speedR == undefined) throw "Rotation speed is missing.";
                if (isNaN(speedR)) throw "Rotation speed is not a number.";
                if (angle == undefined) throw "Angle given is missing.";
                if (isNaN(angle)) throw "Given rotation angle is not a number.";
                break;
            case 'mood':
                const expression = actionDatas.iExpression;
                const moodSpeed = parseFloat(actionDatas.iSpeed);

                if (!isAllowedMood(expression, expressionList)) throw "The specified expression \"" + expression + "\" is not valid.";
                if (moodSpeed == undefined) throw "Mood's speed is missing.";
                if (isNaN(moodSpeed)) throw "Given mood speed is not a number.";
                break;
            case 'yes_move':
                const headSpeedY = parseFloat(actionDatas.speed);
                const headAngleY = parseFloat(actionDatas.angle);

                if (headSpeedY == undefined) throw "The \"yes\" head movement is missing.";
                if (headAngleY == undefined) throw "The \"yes\" target angle is missing.";
                if (isNaN(headSpeedY)) throw "Yes head movement speed is not a number.";
                if (isNaN(headAngleY)) throw "Yes head angle is not a number.";
                break;
            case 'no_move':
                const headSpeedN = parseFloat(actionDatas.speed);
                const headAngleN = parseFloat(actionDatas.angle);

                if (headSpeedN == undefined) throw "The \"no\" head movement is missing.";
                if (headAngleN == undefined) throw "The \"no\" target angle is missing.";
                if (isNaN(headSpeedN)) throw "No head movement speed is not a number.";
                if (isNaN(headAngleN)) throw "No head angle is not a number.";
                break;
            case 'enable_yes':
            case 'enable_no':
                if (parseInt(actionDatas.state) == undefined) throw "There's no value to determine if head mouvement should be enabled or not.";
                if (isNaN(parseInt(actionDatas.state))) throw "Enable yes/no value is not a number.";
                break;
            case 'enable_wheels':
                if (actionDatas.left == undefined || actionDatas.right == undefined) throw "Enabling wheel parameters are missing.";
                if (isNaN(parseInt(actionDatas.left)) || isNaN(parseInt(actionDatas.right))) throw "Enabling wheel parameters are not a number."
                break;
            case 'speak':
                if (actionDatas.iText == undefined) throw "Text is missing for speaking action.";
                if (actionDatas.iExpression == undefined) throw "Expression is missing for speaking action.";
                if (isAllowedMood(actionDatas.iExpression, speakExpressList)) throw "Expression (" + actionDatas.iExpression + ") is not a valid speaking expression.";
                break;
            case 'LED':
                //Method: "blinkLed".
                const ledId = parseInt(actionDatas.iLedId);
                const color = actionDatas.iColor;
                const period = parseInt(actionDatas.iPeriod);

                if (ledId == undefined) throw "Specified LED Id value is missing.";
                if (color == undefined) throw "The color hex is missing.";
                if (period == undefined) throw "Blinking period is missing.";
                if (isNaN(ledId)) throw "LED Id is not a number.";
                if (isNaN(period)) throw "Blinking period value is not a number.";
                break;
            default:
                throw "The action type (\"" + actionType + "\") is not an allowed type for Buddy.";
        }
    } catch (err) {
        console.log("The data in the payload is not correct. Error: " + err);
        return err;
    };
    return "";
}

function isAllowedMood(expression, expressionList) {
    let isAllowed = false;

    for (let i = 0; i < expressionList?.length && !isAllowed; i++) {
        isAllowed = expression == expressionList[i];
    }

    return isAllowed;
}

function createConnection(connectionName, method) {

    //TODO: Disconnect the previous connection, if it exists.
    //if (usedConnection) usedConnection.disconnect();

    switch (connectionName) {
        case "Websocket":
            usedConnection = new WebSocketConnexion(wsPort);
            break;
        case "CoAP":
            usedConnection = new CoAPConnexion(wsPort);
            usedConnection.method(method);
            break;
        case "HTTP":
            usedConnection = new HTTPConnexion(wsPort);
            break;
        case "MQTT":
            usedConnection = new MQTTConnexion(wsPort);
            break;
        default:
            if (!connectionName) throw "No connection name was provided.";
            else throw "The provided connection name (" + connectionName + ") does not exist.";
            break;
    }

    return "Created " + connectionName + " connection.";
}