package net.ptidej.buddytherobot;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.RemoteException;
import android.text.format.Formatter;
import android.util.Log;
import android.widget.Toast;

import com.bfr.buddy.usb.shared.IUsbCommadRsp;
import com.bfr.buddysdk.BuddyActivity;
import com.bfr.buddysdk.BuddySDK;
import android.content.Context;
import android.content.SharedPreferences;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;

public class MainActivity extends BuddyActivity {
    SharedPreferences sharedPreferences;
    QueuePreferences nextTask;
    public static final String BuddyMove = "moveKey";
    public static final String BuddyRotate = "rotateKey";
    public static final String BuddyEnableWheel = "enableWheelKey";
    public static final String BuddySpeak= "speakKey";

    public static final String buddyNextAction="nextAction";
    String TAG = "Move Tuto" ;
    //private SharedPreferences sharedPref;
    private static Context context;
    public static String SERVER_IP = "";
    public static final int SERVER_PORT = 8585;
    private WebSocketClient mWebSocketClient;
    public static final String mypreference = "mypref";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context = getApplicationContext();
        Log.i(TAG,"onCreate finished");
        sharedPreferences = getSharedPreferences(mypreference, Context.MODE_PRIVATE);
        if (sharedPreferences.contains(BuddyMove)) {
           Log.i(TAG,sharedPreferences.getString(BuddyMove, ""));
        }
        if (sharedPreferences.contains(BuddyRotate)) {
            Log.i(TAG,sharedPreferences.getString(BuddyRotate, ""));

        }
        if (sharedPreferences.contains(BuddyEnableWheel)) {
            Log.i(TAG,sharedPreferences.getString(BuddyEnableWheel, ""));
        }
        if (sharedPreferences.contains(BuddySpeak)) {
            Log.i(TAG,sharedPreferences.getString(BuddySpeak, ""));

        }
       // buddyAction();
    }
    @Override
    protected void onStop() {
        super.onStop();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

    }

    @Override
    public void onSDKReady() {
      //  Log.i(TAG,"onSDKReady finished");
       // sharedPreferences = getSharedPreferences(mypreference, Context.MODE_PRIVATE);
          Move m=new Move(0.5f,0.5f,null);
          m.perform();
          startServer();
       // connect2WIMPt();
       // if (sharedPreferences.contains(buddyNextAction)){
       // nextTask=new QueuePreferences(getContext());
       // Log.i(TAG,"Task::::"+nextTask.dequeue());
      //  }
        ready();
        BuddySDK.Speech.startSpeaking("Hello Team");
        buddyAction();

    }
    public void ready(){
        sharedPreferences = getSharedPreferences(mypreference, Context.MODE_PRIVATE);
        SharedPreferences.Editor myEdit = sharedPreferences.edit();
        myEdit.putString(buddyNextAction, null);
        myEdit.apply();
        Log.i(TAG,"In SDK Ready.....IP"+getIP());

        startServer();
        nextTask=new QueuePreferences();
        Log.i(TAG,"Task::::"+nextTask.dequeue());
        if (sharedPreferences.contains(buddyNextAction)){
            nextTask=new QueuePreferences();
            Log.i(TAG,"Task::::"+nextTask.dequeue());
            //Toast.makeText(getContext(),nextTask.dequeue(),Toast.LENGTH_SHORT).show();
        }
    }
    public void buddyAction(){
        Speak s=new Speak("Finish",null);
        Move m2=new Move(0.1f,0.3f,s);
        Rotate r=new Rotate(10.0f,10.0f,m2);
        Move m=new Move(0.1f,0.1f,r);
        EnableWheels a=new EnableWheels(true,m);
        a.perform();
        Log.d(TAG, "COMPLETED BUDDY ACTION");
        sharedPreferences = getSharedPreferences(mypreference, Context.MODE_PRIVATE);
        if (sharedPreferences.contains(BuddyMove)) {
            Log.i(TAG,sharedPreferences.getString(BuddyMove, ""));
        }
        if (sharedPreferences.contains(BuddyRotate)) {
            Log.i(TAG,sharedPreferences.getString(BuddyRotate, ""));

        }
        if (sharedPreferences.contains(BuddyEnableWheel)) {
            Log.i(TAG,sharedPreferences.getString(BuddyEnableWheel, ""));
        }
        if (sharedPreferences.contains(BuddySpeak)) {
            Log.i(TAG,sharedPreferences.getString(BuddySpeak, ""));

        }
    }
   /* public void connect2WIMPt(){
        URI uri;
        String TAG="WimpApp";
        String websocketEndPointUrl;
        try {
           // websocketEndPointUrl="ws://192.168.2.39:8181"; // SocketServer's IP and port [home]
            //websocketEndPointUrl="ws://192.168.191.114:8181"; // SocketServer's IP and port  [lab]
            //websocketEndPointUrl="ws://192.168.50.114:8181"; // SocketServer's IP and port  [androidWiFi]
            websocketEndPointUrl="ws://172.20.10.6:8080"; // SocketServer's IP and port  [androidWiFi]
            uri = new URI(websocketEndPointUrl);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }
        mWebSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake serverHandshake) {
                Log.i(TAG, "WIMP connection is opened");
                mWebSocketClient.send("{\"topicName\":\"test\"}");
                Log.i(TAG,"Client:  " + Build.MANUFACTURER + " " + Build.MODEL);
            }

            @Override
            public void onMessage(String message) {
                sharedPreferences = getSharedPreferences(mypreference, Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.commit();
                try {
                    JSONObject payload = new JSONObject(message);
                    String id=payload.getString("uniqueID");
                    String receivedOn=payload.getString("receivedOn");
                    String buddyPayload=payload.getString(" buddyPayload");
                    String buddyPayloadExecutionStatus=payload.getString("buddyPayloadExecutionStatus");
                    String buddyPayloadExecutionOutcome=payload.getString(" buddyPayloadExecutionOutcome");
                    String triggeringEvent=payload.getString("triggeringEvent");
                   Log.i(TAG,id+" "+receivedOn+" "+buddyPayload+" "+buddyPayloadExecutionStatus+" "+buddyPayloadExecutionOutcome+" "+triggeringEvent);

                }catch(Exception e){
                    Log.i(TAG,"Invalid payload"+message);
                }

                //buddyAction();
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                Log.i(TAG, "Closed, code= " + code+", reason="+reason+", remote="+remote);
            }

            @Override
            public void onError(Exception e) {

                Log.i(TAG, "Error " + e.getMessage());
            }
        };
        mWebSocketClient.connect();

    } */

    public static Context getContext() {
        return context;
    }
    public void startServer() {
        int port = 8585;
        try {
            BuddySocketServer s = new BuddySocketServer(port);
            s.start();
            Log.i(TAG, "Server started on port:" + s.getPort());
        } catch (Exception e) {
        }
    }
    private String getIP(){
        Context context = getContext().getApplicationContext();
        WifiManager wm = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        String ip = Formatter.formatIpAddress(wm.getConnectionInfo().getIpAddress());
        return ip;
    }

}