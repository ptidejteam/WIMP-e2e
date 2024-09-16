/* eslint-disable */
<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <!-- App Bar -->
        <v-app-bar app color="blue-grey" dark class="mt-2">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>
            <v-btn text @click="goToStep(1)">Collect</v-btn>
            <v-btn text @click="goToStep(2)">Payload</v-btn>
            <v-btn text @click="goToStep(3)">Test</v-btn>
            <v-btn text @click="goToStep(4)">Result</v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="switchLanguage">Language</v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                {{ currentLanguage }}
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(lang, index) in languages" :key="index" @click="changeLanguage(lang)">
                <v-list-item-title>{{ lang }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn text @click="logout">
            {{ username }}
            <v-icon class="mr-2" color="light-blue">mdi-logout</v-icon>
          </v-btn>
        </v-app-bar>

        <!-- Stepper -->
        <v-stepper v-model="currentStep" vertical class="mt-2">
          <v-stepper-header class="mt-2">
            <v-stepper-step :complete="currentStep > 1" step="1">
              <v-icon x-large color="green">mdi-server</v-icon>
              <v-stepper-step-content>
                <span>Information Collection</span>
              </v-stepper-step-content>
            </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step :complete="currentStep > 2" step="2">
              <v-icon x-large color="pink">mdi-download</v-icon>
              <v-stepper-step-content>
                <span>Payload Selection</span>
              </v-stepper-step-content>
            </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step :complete="currentStep > 3" step="3">
              <v-icon x-large color="indigo">mdi-play-circle</v-icon>
              <v-stepper-step-content>
                <span>Running Test</span>
              </v-stepper-step-content>
            </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step :complete="currentStep > 4" step="4">
              <v-icon x-large color="teal">mdi-chart-line</v-icon>
              <v-stepper-step-content>
                <span>Test Results</span>
              </v-stepper-step-content>
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>

        <!-- Step 1: System Information Collection -->
        <div v-if="currentStep === 1">
          <v-card>
            <v-card-title>System Information</v-card-title>
            <v-card-text>
              <p>Please upload the following details about the system to be tested...</p>
              <v-form @submit.prevent="submitSystemInfo">
                <v-text-field v-model="systemName" label="System Name" required outlined filled></v-text-field>
                <input type="file" @change="handleFileUpload" accept=".json"/>
                <div v-if="isJSONFile" class="valid-json">Valid JSON file</div>
                <div v-else class="invalid-json" v-for="(error, index) in jsonErrors" :key="index">{{ error }}</div>
                <v-btn :disabled="isSubmitDisabled" color="blue" dark @click="nextStep" class="mt-4">SUBMIT</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </div>

        <!-- Step 2: Payload Selection -->
        <div v-else-if="currentStep === 2" class="text-center">
          <v-card>
            <v-card-title>Payload Selection</v-card-title>
            <v-card-text>
              <p>Wait while the payload is being processed...</p>
              <v-form @submit.prevent="submitPayload">
                <v-textarea v-model="selectedPayload" label="Process Payload" required outlined filled></v-textarea>
                <v-btn color="blue" dark @click="analyzePayload">SAVE & CONTINUE</v-btn>
                <v-btn color="blue" dark class="ml-2" @click="back">BACK</v-btn>
              </v-form>
              <div v-if="payloadError" class="error">{{ payloadError }}</div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Step 3: Test Execution -->
        <div v-else-if="currentStep === 3">
          <v-card>
            <v-card-title>Test Execution</v-card-title>
            <v-card-text>
              <!-- Dropdown list pour sélectionner TC_ID -->
              <v-row justify="start">
                <v-col cols="auto">
                  <v-select
                    v-model="inputTC_ID"
                    :items="availableTC_IDs"
                    label="Select TC_ID"
                    outlined
                    filled
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Zone de texte pour entrer TC_ID -->
              <v-row justify="start" class="mt-2">
                <v-col cols="auto">
                  <v-text-field
                    v-model="inputTC_ID"
                    outlined
                    filled
                    style="width: 180px; height:100px;"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Bouton Go pour charger les résultats -->
              <v-row justify="start" class="mt-2">
                <v-col cols="auto">
                  <!--<v-btn color="blue" dark @click="goToResultss">RESULT</v-btn>-->
                  <v-btn color="blue" dark class="ml-2" @click="goToResults">FETCH RESULTS</v-btn>
                  <v-btn color="blue" dark class="ml-2" @click="back">BACK</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Step 4: Test Results -->
        <div v-else-if="currentStep === 4">
          <v-card>
            <v-card-title>Test Results</v-card-title>
            <v-card-text>
              <div class="text-center">
                <v-btn color="blue" dark class="mx-auto" @click="downloadReport">DOWNLOAD REPORT</v-btn>
              </div>
              <v-divider class="my-4"></v-divider>

              <!-- Summary Section -->
              <v-row>
                <v-col id="summarySection" cols="12" md="6">
                  <v-card outlined>
                    <v-card-title>Summary</v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="black-text">Total Tests : {{ testSummary.totalTests }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="green-text">Passed: {{ testSummary.passed }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="red-text">Failed: {{ testSummary.failed }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Graph Section -->
                <v-col id="graphSection" cols="12" md="6">
                  <v-card outlined>
                    <v-card-title>Test Results Graph</v-card-title>
                    <v-card-text>
                      <canvas id="resultsChart" style="height: 300px;"></canvas>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Detailed Results Section -->
              <v-card id="detailsSection" outlined>
                <v-card-title>Detailed Results</v-card-title>
                <v-card-text>
                  <v-data-table :headers="tableHeaders" :items="detailedResults" class="elevation-1">
                    <template v-slot:top>
                      <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
                    </template>
                    <template v-slot:item.indicator="{ item }">
                      <v-icon :color="item.succeded === 'Success' ? 'green' : 'red'">mdi-square</v-icon>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </div>

        <!-- Modal Dialog -->
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title class="headline">Payload Analysis Result</v-card-title>
            <v-card-text>
              <div v-for="(message, index) in analysisMessages" :key="index">
                {{ message }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-content>
    <v-footer color="red">
      <v-container fluid>
        <v-row>
          <v-col>
            <v-spacer></v-spacer>
            <div class="text-center">
              <span style="text-align: center;">&copy; 2024. Ptidej Team @ Concordia University. All Rights Reserved.</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      inputTC_ID: '',
      availableTC_IDs: [],
      selectedPayload: '',
      isJSONFile: false,
      jsonErrors: [],
      isSubmitDisabled: true,
      currentStep: 1,
      systemName: '',
      drawer: false,
      username: '',
      currentLanguage: 'English',
      languages: ['English', 'French', 'Spanish'],
      testSummary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
      },
      detailedResults: [],
      search: '',
      tableHeaders: [
        { text: 'Test Case ID', value: 'TC_ID' },
        { text: 'Operation', value: 'operation' },
        { text: 'Target', value: 'target' },
        { text: 'Inputs', value: 'inputs' },
        { text: 'Received On', value: 'receivedOn' },
        { text: 'Message', value: 'message' },
        { text: 'Actual Result', value: 'actualResult' },
        { text: 'Status', value: 'succeded' },
        { text: 'Indicator', value: 'indicator', sortable: false }
      ],
      payloadError: '',
      dialog: false,
      analysisMessages: []
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++;
      }
    },
    submitSystemInfo() {
      if (this.systemName.trim() !== '' && this.isJSONFile) {
        this.nextStep();
      } else {
        alert("Please enter the system name and upload a valid JSON file.");
      }
    },
    submitPayload() {
      if (this.selectedPayload.trim() !== '') {
        this.nextStep();
      } else {
        alert("Please enter the payload.");
      }
    },
    analyzePayload() {
      const jsonPayload = JSON.parse(this.selectedPayload);

      axios.post('http://localhost:3006/payload', { jsonContent: this.selectedPayload })
        .then(response => {
          console.log(response.data);

          const payloadID = jsonPayload.TC_ID || "Unknown ID";
          const payloadName = jsonPayload.name || "Unnamed Payload";
          const operationMessages = jsonPayload.steps.map(step => {
            const operation = step.operation;
            return `Added payload "${operation}" to history database.`;
          });

          this.analysisMessages = [
            `Starting analysis of payload with TC_ID: "${payloadID}"`,
            `Payload name: "${payloadName}"`,
            ...operationMessages,
            'Added payloads successfully'
          ];
          this.dialog = true;
          this.nextStep();
          this.execPayload(this.selectedPayload);
        })
        .catch(error => {
          console.error("There was an error analyzing the payload:", error);
          this.payloadError = "There was an error analyzing the payload: " + error.message;
          this.analysisMessages = [error.response?.data || "There was an error analyzing the payload: " + error.message];
          this.dialog = true;
        });
    },

    execPayload(payload) {
      axios.post('http://localhost:3006/execpayload', { jsonFile: payload })
        .then(response => {
          console.log("Payload sent to WIMP:", response.data);
          this.analysisMessages.push("Payload successfully sent to WIMP.");
          console.log("Payload sent to WIMP:", JSON.stringify(payload, null, 2));
          this.analysisMessages.push("Complete payload sent to WIMP:");
          this.analysisMessages.push(JSON.stringify(payload, null, 2));
          this.dialog = true;
        })
        .catch(error => {
          console.error("Error sending payload to WIMP:", error);
          this.analysisMessages.push("Failed to send payload to WIMP: " + error.message);
          this.dialog = true;
        });
    },

    goToResultss() {
      if (this.inputTC_ID.trim() !== '') {
        this.loadTestResults();
        this.currentStep = 4;
      } else {
        alert('Please enter a valid TC_ID.');
      }
    },

    async goToResults() {
      if (this.inputTC_ID.trim() !== '') {
        try {
          const fetchResponse = await axios.get('http://localhost:3003/fetchtestresults', {
            params: { TC_ID: this.inputTC_ID }
          });
          console.log(fetchResponse.data);
          alert(fetchResponse.data);
          await this.loadTestResults();
          this.currentStep = 4;
        } catch (error) {
          console.error('Error fetching test results:', error);
          alert('Failed to fetch test results. Displaying saved results.');
          await this.loadTestResults();
          this.currentStep = 4;
        }
      } else {
        alert('Please select a valid TC_ID.');
      }
    },
    async loadAvailableTC_IDs() {
      try {
        const response = await axios.get('http://localhost:3003/getavailabletcids');
        console.log('Available TC_IDs:', response.data);
        this.availableTC_IDs = response.data;
      } catch (error) {
          console.error('Failed to load available TC_IDs:', error);
      }
    },

    async loadTestResults() {
      try {
        const TC_ID = this.inputTC_ID; 

        if (!TC_ID) {
          console.error("TC_ID is undefined");
          return;
        }
        const response = await axios.get('http://localhost:3003/gettestresults', {
          params: { TC_ID: TC_ID }
        });

        const results = response.data;

        if (!results || results.length === 0) {
          console.log(`No tests found with TC_ID of ${TC_ID}`);
          return;
        }

        this.detailedResults = results.map(result => ({
          TC_ID: result.TC_ID,
          operation: result.operation,
          target: JSON.stringify(result.target, null, 2),
          inputs: JSON.stringify(result.inputs, null, 2),
          receivedOn: result.receivedOn,
          message: result.message,
          actualResult: result.actualResult,
          succeded: result.succeded ? 'Success' : 'Fail'
        }));

        this.testSummary.totalTests = results.length;
        this.testSummary.passed = results.filter(r => r.succeded).length;
        this.testSummary.failed = results.filter(r => !r.succeded).length;

        this.renderChart();
      } catch (error) {
        console.error("Failed to load test results:", error);
      }
    },
    renderChart() {
      const ctx = document.getElementById('resultsChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Passed', 'Failed'],
          datasets: [{
            label: '# of Tests',
            data: [this.testSummary.passed, this.testSummary.failed],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedPayload = e.target.result;
          this.parseJSON();
        };
        reader.readAsText(file);
      } else {
        this.isJSONFile = false;
        this.jsonErrors = ["Please select a valid JSON file."];
        this.selectedPayload = '';
        this.isSubmitDisabled = true;
      }
    },
    parseJSON() {
      try {
        this.parsedPayload = JSON.parse(this.selectedPayload);
        this.isJSONFile = true;
        this.jsonErrors = [];
        this.isSubmitDisabled = false;
      } catch (error) {
        this.isJSONFile = false;
        this.jsonErrors = [`JSON parsing error: ${error.message}`];
        this.isSubmitDisabled = true;
        this.parsedPayload = null;
      }
    },
    switchLanguage() {
      this.currentLanguage = this.currentLanguage === 'English' ? 'French' : 'English';
    },
    changeLanguage(lang) {
      this.currentLanguage = lang;
    },
    goToStep(step) {
      this.currentStep = step;
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push({ name: 'login' });
    },
    downloadReport() {
      const doc = new jsPDF('p', 'mm', 'a4');
      let yOffset = 10;
      const summaryElement = document.getElementById('summarySection');
      html2canvas(summaryElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        doc.text('Summary', 10, yOffset);
        yOffset += 10;
        doc.addImage(imgData, 'PNG', 10, yOffset, 190, canvas.height * 190 / canvas.width);
        yOffset += canvas.height * 190 / canvas.width + 10;

        if (yOffset + 70 > doc.internal.pageSize.height) {
          doc.addPage();
          yOffset = 10;
        }
        const graphElement = document.getElementById('graphSection');
        html2canvas(graphElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          doc.text('Graph', 10, yOffset);
          yOffset += 10;
          doc.addImage(imgData, 'PNG', 10, yOffset, 190, canvas.height * 190 / canvas.width);
          yOffset += canvas.height * 190 / canvas.width + 10;

          if (yOffset + 70 > doc.internal.pageSize.height) {
            doc.addPage();
            yOffset = 10;
          }
          const detailsElement = document.getElementById('detailsSection');
          html2canvas(detailsElement, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            doc.text('Details', 10, yOffset);
            yOffset += 10;
            doc.addImage(imgData, 'PNG', 10, yOffset, 190, canvas.height * 190 / canvas.width);
            yOffset += canvas.height * 190 / canvas.width + 10;
            doc.save('report.pdf');
          });
        });
      });
    }
  },
  mounted() {
    this.loadAvailableTC_IDs();

    if (this.currentStep === 4) {
      this.$nextTick(() => {
        this.loadTestResults();
      });
    }
  }
};
</script>

<style scoped>
.valid-json {
  color: green;
  font-weight: bold;
}
.invalid-json {
  color: red;
  font-weight: bold;
}
.error {
  color: red;
  margin-top: 10px;
}
.black-text {
  font-weight: bold;
  color: black;
}
.green-text {
  font-weight: bold;
  color: green;
}
.red-text {
  font-weight: bold;
  color: red;
}
</style>
