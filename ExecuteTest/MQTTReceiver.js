import mqtt from 'mqtt';
import Receiver from './Receiver.js';

export default class MQTTReceiver extends Receiver {

    #client;

    constructor(tc_id) {
        super(tc_id);
        this.#client = mqtt.connect("mqtt://localhost:" + tc_id);

        this.#client.on("connect", () => {
            this.#client.subscribe("presence", (err) => {
                if (!err) {
                    console.log("Receiver connected to app with MQTT.");
                }
            });
        });

        this.#client.on("message", async (topic, result) => {
            
            console.log("MQTT received a message from the app: " + result.toString());
        });
    }

    disconnect() {
        this.#client.end();
    }

}