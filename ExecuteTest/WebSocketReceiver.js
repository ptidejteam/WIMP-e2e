import { WebSocket } from 'ws';
import Receiver from './Receiver.js';

export default class WebSocketReceiver extends Receiver {

    #webSocket;

    constructor(tc_id) {
        super(tc_id);

        //this.#webSocket = new WebSocket('ws://localhost:' + tc_id);
        this.#webSocket = new WebSocket('ws://192.168.0.197:8484');

        this.#webSocket.onmessage = async (result) => {

            console.log("WebSocket received a message from the app: ", result.data);
        }
    }

    disconnect(){
        this.#webSocket.close();
    }
}