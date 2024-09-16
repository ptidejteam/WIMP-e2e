const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const client = new MongoClient(process.env.MONGO_URL);

let db;

async function TryDatabaseConnect() {
    try {
        await client.connect();
        db = client.db(process.env.MONGO_DB);
        console.log("Connected to the database \"ioTDatabase\".");
    } catch (e) {
        console.error(e);
    }
}

TryDatabaseConnect();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.listen(port, () => console.log(`Authentification service is listening on port ${port}`));

function generateJWTToken(userEmail) {
    const payload = {
        name: userEmail,
        admin: userEmail.toLowerCase().includes("admin")
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'secretsauce', { algorithm: 'HS256', expiresIn: '1h' });
}

// Creating user
app.post('/users', async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    if (userName && userEmail && userPassword) {
        try {
            const hashedPassword = await bcrypt.hash(userPassword, 10);
            const users = { userName, userEmail, userPassword: hashedPassword };

            await db.collection(process.env.MONGO_COLLECTION).insertOne(users);
            res.status(201).send("User was successfully created.");
        } catch (err) {
            if (err.code == 11000) res.status(400).send("Could not create user. The username, email is already used by someone else.");
            else res.status(500).send("Caught unknown error: " + err);
        }
    } else {
        res.status(400).send("Could not create user. Some fields have not been filled. Please try again.");
    }
});

// Getting a user to connect them to app.
app.post('/login', async (req, res) => {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
        return res.status(400).send("Email and password are required.");
    }

    try {
        const user = await db.collection(process.env.MONGO_COLLECTION).findOne({ userEmail });

        if (!user) {
            return res.status(400).send("Error. Could not find and connect to: " + userEmail + ". Maybe it does not exist, or email and/or user password is incorrect.");
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword);

        if (!isMatch) {
            return res.status(400).send("Error. Email and/or password is incorrect.");
        }

        res.status(200).send(generateJWTToken(userEmail));
    } catch (e) {
        res.status(500).send("Error while trying to find user: " + e);
    }
});

module.exports = app;
