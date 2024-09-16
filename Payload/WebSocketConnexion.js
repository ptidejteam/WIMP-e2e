import { WebSocket } from 'ws';
import Connection from './Connection.js';

export class WebSocketConnexion extends Connection{

    #webSocket;

    _url = 'ws://localhost:';

    constructor(portNumber) {
        super();
        //this.#webSocket = new WebSocket(this._url + portNumber);
        this.#webSocket = new WebSocket('ws://192.168.0.197:8484');
    }

    async sendJson(jsonFile) {
        if(this.#webSocket.readyState === WebSocket.OPEN){
            this.#webSocket.send(jsonFile);
            console.log("Successfully sent payload to the app with WebSocket.")
        } else {
            console.log("WebSocket connection not open. Waiting...");
            await this.waitForOpenConnection();
            this.#webSocket.send(jsonFile);
            console.log("Successfully sent payload to the app with WebSocket.")
        }
        
    }

    waitForOpenConnection(){
        return new Promise((resolve, reject) => {
            const maxAttempts = 20;
            const intervalTime = 200;

            let attempt = 0;
            const interval = setInterval(() => {
                if(attempt > maxAttempts - 1){
                    clearInterval(interval);
                    reject(new Error("Could not connect. Maximum number of attempts has been exceeded."));
                } else if(this.#webSocket.readyState === WebSocket.OPEN) {
                    clearInterval(interval);
                    resolve();
                }
                attempt++;
            }, intervalTime);
        });
    }

    disconnect(){
        this.#webSocket.close();
    }

    get webSocket(){
        return this.#webSocket;
    }

}