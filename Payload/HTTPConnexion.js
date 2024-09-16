import XMLHttpRequest from 'xmlhttprequest';
import Connection from './Connection.js';

export class HTTPConnexion extends Connection {
    //#url;

    #http;

    constructor(portNumber) {
        super();
        this._url = portNumber;
        this.#http = new XMLHttpRequest.XMLHttpRequest();

        this.#http.open("GET", "http://locahost:" + this._url);
    }

    sendJson(jsonFile) {
        this.#http.send(jsonFile);
    }

    disconnect(){
        //TODO: Add a way to close the xmlhttprequest connection if it does not close correctly.
    }

    get http() {
        return this.#http;
    }
}