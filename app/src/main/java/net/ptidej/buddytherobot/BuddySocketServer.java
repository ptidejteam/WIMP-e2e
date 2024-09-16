package net.ptidej.buddytherobot;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONException;
import org.json.JSONObject;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class BuddySocketServer extends WebSocketServer {
    private final String TAG="SOCKET SERVER";
    private final String TAGSTATUS="EXECUTION STATUS";
    QueuePreferences newTask=new QueuePreferences();
    LogPreferences logTracker=new LogPreferences();
    SharedPreferences sharedPreferences;
    public static final String mypreference = "mypref";
    public static final String buddyNextAction="nextAction";
    public BuddySocketServer(int port) throws UnknownHostException {
        super(new InetSocketAddress(port));
    }
    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
       // conn.send("Welcome to the server!"); //This method sends a message to the new client
       // conn.send("New Connection From " + conn.getRemoteSocketAddress().getAddress().getHostAddress()); //This method sends a message to all clients connected
        Log.i(TAG,conn.getRemoteSocketAddress().getAddress().getHostAddress() + " Connected!");
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        conn.send(conn.getRemoteSocketAddress().getAddress().getHostAddress()  + " :disconnected!");
        conn.close();
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        //sharedPreferences = MainActivity.getContext().getSharedPreferences(mypreference, Context.MODE_PRIVATE);
        //  SharedPreferences.Editor editor = sharedPreferences.edit();
        //newTask.enqueue(message);
        // editor.putString(buddyNextAction, message);
        // editor.commit();
        // String n=newTask.dequeue();
        Log.i("Received:",message);
        String trimmedPayload = message.substring(1, message.length() - 1);
        Log.i("Trimmed Message:",trimmedPayload);
        newTask.enqueue(trimmedPayload);
        int taskId=0;
        addLog(TAG,"Payload Received:");
        String nextPayload=newTask.dequeue();
        try {

            JSONObject payload = new JSONObject(nextPayload);

            String operation=payload.getString("operation");
            String opName=getActionName(operation);
            Log.i("Action Name:",opName);
            String inputs=payload.getString("inputs");
            //JSONObject inputObject = new JSONObject(inputs);
            taskId=payload.getInt("id");
            Log.i("TASK_ID:","Task ID:"+taskId);
            List<Object> values = parsedParameters(inputs);
            StringBuilder result = new StringBuilder();
            if (values.size() > 1) {
                for (int i = 0; i < values.size(); i++) {
                    result.append(values.get(i));
                    if (i < values.size() - 1) {
                        result.append("/");
                    }
                }
            } else if (values.size() == 1) {
                result.append(values.get(0));
            }
            Log.i(TAG,operation+" "+inputs+"/"+result);
            Log.i(TAG,operation+"/"+result);
            addLog(TAG,"Payload Validated"+taskId);
            if(opName.contains("move")){
                Object[] parameters=values.toArray();
                float param1=Float.parseFloat((parameters[0]).toString());
                float param2=Float.parseFloat((parameters[1]).toString());
                Log.i("Distance:","Distance::"+param2);
                Log.i("Speed:","Speed::"+param1);
                Move m=new Move(param1,param2,null);
                m.perform();
                Log.i("Executed Payload:::","move");
            }
            if(opName.contains("Wheels")){
                Object[] parameters=values.toArray();
                int param1=Integer.parseInt((parameters[0]).toString());
               // int param2=Integer.parseInt((parameters[1]).toString());
                boolean wheelsStatus=param1==1?true:false;

                EnableWheels m=new EnableWheels(wheelsStatus,null);
                m.perform();
               Log.i("Executed Payload:::","enableWheels");
            }
            if(opName.contains("rotate")){
                Object[] parameters=values.toArray();
                float param1=Float.parseFloat((parameters[0]).toString());
                float param2=Float.parseFloat((parameters[1]).toString());
                Log.i("Angle:","Angle::"+param2);
                Log.i("Speed:","Speed::"+param1);

                Rotate r=new Rotate(param1,param2,null);
                r.perform();
                Log.i("Executed Payload:::","rotate");
            }
            if(opName.contains("speak")){
                Object[] parameters=values.toArray();
                String speech=parameters[0].toString();
                Speak s=new Speak(speech,null);
                s.perform();
                Log.i("Executed Payload:::","speak");
            }
        }catch(Exception e){
            Log.i(TAG,e.toString());
            addLog(TAG,e.getMessage());
        }
        setExecutionStatus("name", "WHEELS_ENABLE_FINISHED");
        Log.i("LOG::::",logTracker.logQueue());
        String s1=returnExecutionStatus("name");
        Log.i(TAGSTATUS,s1);
        try {
            String sentResponse=wimpResponse(executionFeedback(taskId,s1),logTracker.logQueue());
            Log.i("SENT RESPONSE:",sentResponse);
            conn.send(sentResponse);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    private String wimpResponse(String executionFeedback, String executionLog) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("ExecutionFeedback", executionFeedback);
        jsonObject.put("Logs", executionLog);

        return jsonObject.toString();
    }
    public void setExecutionStatus(String action,String status){
        sharedPreferences = MainActivity.getContext().getSharedPreferences(mypreference, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(action, status);
        editor.commit();
    }
    public String executionFeedback(int taskId,String status){
        String jsonString;
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", taskId);
            jsonObject.put("executionStatus", status);
            jsonString = jsonObject.toString();
            Log.i("EXECUTION STATUS_RESULTS:",jsonString);
            return jsonString;
        }catch(Exception e){
            return e.toString();
        }

    }
    public String returnExecutionStatus(String action){
        String executionStatus;
        if (sharedPreferences.contains(action)) {
            Log.i(TAGSTATUS,sharedPreferences.getString(action, ""));
            executionStatus=sharedPreferences.getString(action, "");
        }
        else{
            executionStatus="";
        }
        return executionStatus;
    }
    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.toString();
        addLog(TAG,ex.getMessage());
        if (conn != null) {
            // some errors like port binding failed may not be assignable to a specific websocket
        }
    }

    @Override
    public void onStart() {
        System.out.println("Server started!");
        setConnectionLostTimeout(0);
        setConnectionLostTimeout(100);

    }
    public void addLog(String TAG,String message){
        LogEntry logEntry=new LogEntry(TAG,message);
        logTracker.enqueue(logEntry);
    }
    public String getActionName(String input) {
        if (input == null) {
            return "unknownMethod";
        }

        input = input.toLowerCase(); // Make the input case-insensitive

        if (input.contains("move")) {
            return "move";
        } else if (input.contains("rotate") || input.contains("turn")) {
            return "rotate";
        } else if (input.contains("speak")) {
            return "speak";
        } else if (input.contains("wheels")) {
            return "enableWheels";
        } else {
            return "unknownMethod";
        }
    }
    public List<Object> parsedParameters(String jsonString) {
        List<Object> values = new ArrayList<>();
        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            // Iterate through the keys of the JSON object
            Iterator<String> keys = jsonObject.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object value = jsonObject.get(key);
                values.add(value);
            }
            return values;
        }catch(Exception e){
            addLog(TAG,e.getMessage());
            return null;
        }

    }

}
