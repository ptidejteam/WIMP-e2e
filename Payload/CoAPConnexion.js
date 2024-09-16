import nodeCoap from 'node-coap-client';
import Connection from "./Connection.js";

export class CoAPConnexion extends Connection{

    //#url;

    #client;
    #method;

    constructor(portNumber) {
        super();
        this._url = "coap://localhost:" + portNumber;
        this.connectToServer();
    }

    async connectToServer() {
        try {
            this.#client = await nodeCoap.CoapClient.tryToConnect(this._url);
        } catch (err) {
            console.error("Error while trying to connect with CoAP: ", err);
        }

    }

    set method(method){
        this.#method = method;
    }

    sendJson(jsonPayload) {
        if(!this.#method) nodeCoap.CoapClient.request(this._url, "post", jsonPayload);
        else nodeCoap.CoapClient.request(this._url, this.#method, jsonPayload);
    }

    disconnect(){
        nodeCoap.CoapClient.reset(this._url);
    }
}