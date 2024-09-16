import mqtt from 'mqtt';
import Connection from './Connection.js';

export class MQTTConnexion extends Connection {

    #client;

    _url = "mqtt://localhost:";

    constructor(portNumber) {
        super();
        this.#client = mqtt.connect(this._url + portNumber);

        this.#client.on("connect", () => {
            this.#client.subscribe("presence", (err) => {
                if (!err) {
                    console.log("Sender connected to app with MQTT.");
                }
            });
        });
    }

    sendJson(jsonContent) {
        this.#client.publish("Payload", jsonContent);
    }

    disconnect(){
        this.#client.end();
    }
}