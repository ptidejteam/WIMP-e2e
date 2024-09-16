import XMLHttpRequest from 'xmlhttprequest';
import Receiver from './Receiver.js';

export default class HTPPReceiver extends Receiver {

    #url;
    #http;

    constructor(tc_id) {
        super(tc_id);
        //this.#url = tc_id;
        this.#http = new XMLHttpRequest.XMLHttpRequest();

        this.#http.open("GET", "http://locahost:" + this.#url);

        this.#http.onreadystatechange = async (event) => {

            console.log("HTTP received a message from the app: " + this.#http.responseText);
        }
    }

    sendJson(jsonFile) {
        this.#http.send(jsonFile);
    }

    disconnect(){
        //TODO: Add a way to close the xmlhttprequest connection if it does not close correctly.
    }
}