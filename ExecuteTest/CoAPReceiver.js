import nodeCoap from 'node-coap-client';
import Receiver from './Receiver.js';

export default class CoAPReceiver extends Receiver {

    #url;
    #client;
    #method;

    constructor(tc_id) {
        super(tc_id);
        this.#url = "coap://localhost:" + tc_id;
        this.connectToServer();
    }

    async connectToServer() {
        try {
            nodeCoap.CoapClient.observe(this.#url, "get", this.#getCallback());
        } catch (err) {
            console.error("Error while trying to connect with CoAP: ", err);
        }
    }

    #getCallback(){
        return async function confirmTest(response) {

            console.log("Coap received a message from the app: " + response.payload);
        }
    }

    updateObeserver() {
        nodeCoap.CoapClient.observe(this.#url, this.#method, this.#getCallback());
    }

    disconnect(){
        nodeCoap.CoapClient.reset(this.#url);
    }

    set method(method){
        this.#method = method;
        this.updateObeserver();
    }
}