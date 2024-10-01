# About
This is an app that helps with sending and executing tests towards IoT system applications. The app accepts a payload, a json file that contains the informations on what the system should do, and the expected response it should return. Then, if the payload is correct, the user can send the content to the IoT app for it to execute the commands in the files.

The app also saves and contains the data related to the payload, such as the test results for any finished tests, or the informations about the operations in the payload.

# Microservices
Here are the different services and parts of the application:

- **AuthService:** The service that handles the authentification and registering process for the users, along with handling the database "ioTDatabase" on MongoDB. The service also handles the generation of Tokens to let a user stay logged in.
- **ExecuteTest:** The service that handles the test results, such as receiving the responses from the IoT app, and saving them to the database "testLogDatabse" on MongoDB. It also creates one half of the connection towards the IoT app. Specifically, this half fetches the test results from the IoT app, and saves any new tests results to the MongoDB database.
- **Payload:** The service that handles analysing the payload the user gave, making sure that it is in the right format. Once the payload is confirmed to be correct, it can then send its contents to the specified IoT app. This service also handles creating the connections to the IoT app, and saves the operations that will be performed to the database "historyDatabase" on MongoDB, along with a notice to tell if the test case has been completed or not.
- **ServiceRegistry:** The service that handles all the requests made by the other parts of the app, and sends them to the correct service in the backend. Thanks to this service, the app only needs to reference one localhost to call all of the backend services, in this case `localhost:3006`, except for the interface, which uses its own localhost.
- **uiclient:** This is not a service, but this is still the part of the app that shows the interface, and allows the user to interact with it. It uses the service registry to communicate and send requests to the other services in the backend.
![ProjectDiagram](https://github.com/user-attachments/assets/118f1120-f3b6-4d64-a524-c77f399dcdbb)


# How to Create and Setup the MongoDB Databases

For this app, you will need to create an online MongoDB/Atlas account, along with creating a set of Databases and Collections in a Cluster on the site. Here are the steps to do so:

## Create a MongoDB Account

1. Create a new account on `https://cloud.mongodb.com/`, either by using your email and by writing a password, or by using an already existing Google or Github account.
2. After creating an account, you should be on the "Overview" page, which shows you the data for your clusters and databases.

## Create and Fill a Cluster

3. After creating an account, you can create a cluster, and then fill it with the required databases for this app. On the side bar to the left, click on the "Databases" button.
4. On the "Databases" page, click on the "Build a Database" button to start creating a cluster.
![cluster-db-deployment](https://github.com/user-attachments/assets/770673e3-bdd0-4fb5-803d-e3f881bbec60)

5. Select the cluster type that is free, which should be called "Shared".
6. Similarly, for the cluster tier option, select the "M0 Sandbox" option, which is also free.
7. Once your cluster has been created, go see its collections by pressing the "Browse Collections" button.
![ClustersOverview](https://github.com/user-attachments/assets/c6de2f65-5d92-43cf-86e5-c492515ba45b)

8. Right now, you should only see a sample database called "sample_mflix", with multiple collections inside of it.
9. Create three different databases with the "Create Database" button on the left side of the screen, each with their own, singular collections. There should be one that will contain the users and their authentification infos, one that will contain the history of the payloads, and one that will save the tests results obtained from the IoT app. You can give them any name you wished, for both databases and collections, as long as they make sense for other developpers.

## Add Users that can Access the Cluster

10. After creating a cluster, you will need to create a user that is allowed to use and interact with the databases. Go to the "Database Access" section, found on the side bar to the left.
11. Press the "ADD A NEW DATABASE USER" button to start adding yourself as a user.
12. For the authentification method, pick "Password", and enter a username and password for yourself. You can also use an auto-generated password provided from the site itself.
![AuthentificationMethod](https://github.com/user-attachments/assets/15624f9d-5b62-4e89-90d7-608106a37764)

13. Select the "Add Built-in Role" button, and select the "Atlas Admin" role from the drop-down list to make yourself an admin.
14. Once everything is done, press the "Add User" button to finish adding yourself as a user and admin.

    14.1. Repeat steps 7 to 10 if you wish to add any other users. If you don't want them to be an admin, you can instead give them the "Read and write to any database" role instead.

## Add Valid IP Addresses That can Access the Cluster

15. Next, you will need to configure a network connection so that you can use your IP address to connect safely to your cluster. On the sidebar to the left of the screen, click on the option that says "Network Access".
![NetworksAccess](https://github.com/user-attachments/assets/32ca2b66-7143-4a7c-8b77-799a1061e8f5)

16. Click on the "ADD IP ADRESS" button.
17. Write your IP adress in the "Access List Entry", or just click on the "ADD CURRENT IP ADRESS" button to add the address you are currently using.
18. Click on the "Confirm" button to add that IP adress.

    18.1. If you need to add multiple IP addresses, or you have an IP address that changes often, you can also add "0.0.0.0" to the IP access list. This will allow *any* IP addresses to access your databases, as long as they have the connection string, and the names of those databases and collections.

## Generate the Connection String

19. Now, you will need to generate a connection string to your cluster and databases that the app will need later. To start off, go to the "Databases" section on the sidebar to the left of the screen.
20. You should see the cluster you have previously created. Click on the white "Connect" button that's next to the cluster's name.
![DatabaseClusters](https://github.com/user-attachments/assets/4bf88349-3a26-4ccd-9f92-6a3bbb920eae)

21. For the connection security set-up, select the first option called "Drivers".
![ConnectionOptions](https://github.com/user-attachments/assets/1aafd237-d7cf-4477-91be-3c8597e6c00b)

22. For the "Choose a Connection Step" option, select "Node.js" for the driver, and the version should be "5.5 or later".
23. As the instructions says, make sure MongoDB is installed on your device by typing and running `npm install mongodb` on a terminal.
24. Save the connection string that is given to you locally, which should look something like this: `mongodb+srv://<username>:<password>@<clusterName>.igy1di3.mongodb.net/?retryWrites=true&w=majority&appName=<clusterName>`, but with `<username>` and `<password>` being replaced by the ones you created in the "Add User Access" section. `<clusterName>`, meanwhile, should already be written with your cluster's name.

## Set up the Values in the Environnement Files

25. Finally, it is time to establish the connections between the app's microservices, and the cluster you have created. First, open up the environnement files (".env") for the three backend services (AuthService, ExecuteTest and Payload).
26. In each of these environnement files, you should see those three values: "**MONGO_URL**", "**MONGO_DB**" and "**MONGO_COLLECTION**". AuthService also has another value called "JWT_SECRET", but it is not important for setting up the connection.
27. Paste The connection string you obtained back in step 24 in the "MONGO_URL" values for each files.
    27.1. If you get an error while running the app with that connection string, try the following string instead: `mongodb+srv://<username>:<password>@<clusterName>.igy1di3.mongodb.net/<databaseName>?retryWrites=true&w=majority&appName=<clusterName>`, where all the values marked with a "<>" should be replaced by the relevant information.
28. For both the "MONGO_DB" and "MONGO_COLLECTION" values, you will need to specify the name of each of the databases and collections you have created for each services. Specifically:

    - "AuthService" should get the database and collection that was made for stocking the users for the app and the authentification process.
    - "ExecuteTest" should get the database and collection that will save the test results.
    - "Payload" should get the database and collection that will save and contain the history of the payload it analysed.
29. Once everything is done, try to run the app by following the steps in the next sections. If any problems happen, you can also check for a solution online.

# How to Run the App

1. Clone the repository, and open it in Visual Studio Code. You can either do it directly by copy-pasting the GitHub's link in "GitHub Desktop", or by running the command `git clone https://github.com/baptiste2k8/TestRunner`.
2. If this was not done, install all dependencies used by running `npm install` for the root folder, and for each of the services (As a reminder, you can move into a folder with the command `cd folderName`, and move back to the previous folder with `cd ..`). This should install all the dependencies that are in each services' respective "package.json" files.
3. In the environnement file (".env") for "AuthService", copy and paste a random, 32-characters long string, composed of any letters (upper or lowercase) and numbers (from 0 through 9) as a string in the "**JWT_SECRET**" value. This will act as a secret that "AuthService" will use to generate its Tokens when a user connects successfully to the app.
4. On the terminal, go back to the root folder, if you haven't already done so.
5. Run either `npm run alldev` if you want to run all the backend services with Nodemon, or `npm run allstart` to run all the services with Nodejs. For both cases, the frontend part will be ran the same way.

   5.1. If you want to only run some services, you can run one of the scripts specified in the "package.json" file in the root folder, such as `npm run registrydev` to run "ServiceRegistry" with Nodemon, or `npm run execstart` to run the "ExecuteTest" service with Nodejs.
![ExecutionScripts](https://github.com/user-attachments/assets/39d35b6a-a291-44a4-a399-855c6fb07c3b)

6. Access the login page and the web app by using the specified `localhost` link after the interface has finished building itself.
![LoginScreen](https://github.com/user-attachments/assets/10c7b545-cf27-4515-8a51-18ec94498c97)

7. Log in with your credentials.

   7.1. If you cannot log in, create a new account by signing in.

# How to Submit and Send a Payload

1. After login in, click on the "Upload File" button.
2. Select the Json file that contains the payload that you want to test.
3. If the format is correct, click the "Next" button.
4. You will see the contents of your payload on the screen. Click on the "Save & Continue" button to start analysing and saving the payload's content.
![PayloadAnalysis](https://github.com/user-attachments/assets/5416c9f2-6888-43ca-8f92-dc87b09f072f)

5. If any issues is shown during the analysis, such as the TC_ID value in the file has already been used by another payload, you can modify the text on the screen to correct it, and then try the analysis again.
6. If the app returns a success message, saying that the payload's contents are correct, the app will automatically send the payload to the IoT app.
![SuccessfulAnalysis](https://github.com/user-attachments/assets/5cb8a302-b23e-4b13-bcb5-6cfe9d90a761)

7. Once the payload has been sent, go to the "Results" screen, and go get the data from the test results by specifying the TC_ID you wrote in your JSON file.
![TestResults](https://github.com/user-attachments/assets/5d153138-03a8-40d1-9049-c38ce55f1435)

8. Wait for the app to get and save any finished tests from the IoT app. Once finished, and since the IoT app has to do other tasks than the tests, the app will show you the results of the tests that have been executed, along with the number of them that have succeded or not. If there are any tests missing, do step 7 again to try and get any newly completed tests.

# Payload Data 

Here are the informations that should be in a testing payload:

- **TC_ID:** Contains the identifier to tell users and the app from which payload the specific test came from.
- **name:** Optional. Contains a simple name to describe to other users what the payload and its tests are supposed to do.
- **steps:** An array or list that contains all the tes cases that will be performed. This value contains the following data:
   - **operation:** Contains the name of the method that the IoT app is supposed to execute when it receives the test case.
   - **target:** Optional. If this value is not used, write a generic string like "Non-Applicable" instead of leaving empty or null. Contains the data related to the connection that the IoT app will have to use to successfully send the request to one of the tools in its system. These are composed of the "*protocol*" that will be used (WebSocket, HTTP, etc.), the "*method*" type, such as "POST, GET, PUT, etc.", and the "*name*" of the tool in question.
   - **inputs:** Optional. This value contains the data that is needed to pass in the method or operation to be tested. Wether this value is used or not depends on whether the method in the IoT system requires parameters or not.
   - **expectations:** This value only has one parameter, called "*msg*". This parameter contains the message that the IoT app is supposed to return when this app goes to get the test results. If, in the test results, the expected message and the actual, returned message are the same, the test is concidered to be successful. Otherwise, the test is considered to be failed.

For the "operation" value, the following names and functions are accepted by the program for the analysis, without taking into account case sensitivity :

- "Move";
- "Rotate";
- "Mood";
- "Yes_Move";
- "No_Move";
- "Enable_Yes";
- "Enable_No";
- "Enable_Wheels";
- "Speak";
- "LED";
- "GetData";
- "DetermineBuddy";
- "DetermineFitbit".

# Known Problems and Issues

- The code that analyses the payload's contents is completely hand-written, instead of using a parsing library like "csv-parser" or "xml2js". The code should be modified to use those libraries instead, which will take a large amount of time to change and confirm that it is working just like the previous, manual implementation.
- Certain Express events, such as events that fetches all the elements in a MongoDB collection, are not called. Future developpers should try and see whether these features should be kept or not.
- Related to the above issue, there is no way to delete or remove the contents of the "history" and "test result" databases using the app itself. Users can delete elements by sending a request to certain links using Postman, such as `localhost:3006/flushresultlog` to remove all test results, or "localhost:3006/deletesomehistory" to remove the history of a certain payload, based on the specified TC_ID. However, it would be nice to give make it possible for the user to delete those elements using the app's interface.
- Due to a lack of applications to test them on, the senders and receivers for MQTT and CoAP have never been tested, and mostly just exist as a starting point to fully implement them in the future.
- Certain errors messages shown on the interface are just not descriptive enough. For example, if an error happens while trying to create the receiver in the "ExecuteTest" service, the interface will just say that an Axios error happened with a return code of 500.
- Some method operations for the Fitbit watch and for the WIMP app itself ("GetData", "DetermineBuddy", etc.) are taken into account, but the analysis and confirmation of their values are not as detailed as the ones for the robot Buddy.
- Most of the code for the backend services have "God Class" issues, where the `Index.js` files in each services have most of the implementations written in it. For the sake of refactoring, those bits of code could be moved and migrated to other files or classes.
- To ease connection problems, it would be a good idea to migrate the MongoDB databases from an online version to a local version. That way, if the current connection cannot connect to the Internet, but can still access the IoT app, this app can still work correctly.
- A recent issue has appeared with the graphic in the "Test Results" page that causes it to not show, even after getting the test results from the database.
