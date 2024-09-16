import {insertTestResult, isIDUnique} from "./index.js";
import XMLHttpRequest from 'xmlhttprequest';

export default class Receiver {

    _previousJSON;
    _httpReceiver;

    constructor(TC_ID) {

        this._httpReceiver = new XMLHttpRequest.XMLHttpRequest();

        this._httpReceiver.open("GET", 'http://192.168.0.197:3000/testResults?tc_id=' + TC_ID);

        this._httpReceiver.onreadystatechange = async (event) => {

            //If the request is correct, we move on to analysing the results.
            if (this._httpReceiver.readyState == 4) {
                
                const jsonResults = JSON.parse(this._httpReceiver.responseText).data;

                for (let i = 0; i < jsonResults.length; i++) {
                    
                    if (jsonResults[i].status == 1 && await isIDUnique(jsonResults[i].id)) {
                        const { TC_ID, id, operation, target, inputs, actualResult } = jsonResults[i];
                        const message = jsonResults[i].expectations.msg;
                        const succeded = jsonResults[i].expectations.msg == jsonResults[i].actualResult;
                        const currentDate = new Date();
                        const receivedOn = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + "-" + String(currentDate.getDate()).padStart(2, '0');
                        const testResult = { TC_ID, _id: id, operation, target, inputs, receivedOn, message, actualResult, succeded };

                        const successfulPost = await insertTestResult(testResult);
                        if (successfulPost) console.log("Received test results and saved it successfully.");
                        else console.log("Could not save following test results: ", testResult);
                        
                    }else console.log("There already exists a test results with the ID of \""+ jsonResults[i].id +"\"")
                }
            }
        }
    }

    async insertResult(testResult) {
        return await insertTestResult(testResult);
    }

    createNewReceiver(tc_id) {
        this._httpReceiver = new XMLHttpRequest();

        this._httpReceiver.open("GET", 'http://192.168.0.197:3000/testResults?tc_id=' + tc_id);
    }

    async requestTestResults(TC_ID) {
        this._httpReceiver.open("GET", 'http://192.168.0.197:3000/testResults?tc_id=' + TC_ID);
        await this._httpReceiver.send("Getting the test results");
    };

    get previousJSON() {
        return this._previousJSON;
    }

    set previousJSON(nextJSONiD) {
        this._previousJSON = nextJSONiD;
    }
}