//TODO: Démarrer les autres logiciels (Dans les autres dossiers)
// et les noter dans un tableau ou liste.
const express = require("express");
const bodyParser = require("body-parser");

//TODO: Call avec "require" les pages des autres services.
const ui = require("./UI/index");
const auth = require("./AuthService/index");
const execTest = require("./ExecuteTest/index");
const index = require("./Index/index");
const payload = require("./Payload/index");
const registry = require("./ServiceRegistry/index");

const PORT = 8080;
const HOST_NAME = "localhost";

const app = express();

app.use(express.static("client"));
app.use(bodyParser.urlencoded({extended: true}));

//TODO: Affecter/utiliser les pages des autres services.
app.use("/", ui);
app.use("/", auth);
app.use("/", execTest);
app.use("/", index);
app.use("/", payload);
app.use("/", registry);



app.listen(PORT, HOST_NAME, ()=>{
    console.log(`Server running on ${HOST_NAME}:${PORT}`);
});