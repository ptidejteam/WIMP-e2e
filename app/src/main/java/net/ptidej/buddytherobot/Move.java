package net.ptidej.buddytherobot;

import android.os.RemoteException;
import android.util.Log;

import com.bfr.buddy.usb.shared.IUsbCommadRsp;
import com.bfr.buddysdk.BuddySDK;
import android.content.Context;
import android.content.SharedPreferences;

import java.util.Queue;

public class Move extends Action{
    protected float speed;
    protected float distance;
    private final Action nextAction;
    ExecutionStatus es;
    SharedPreferences sharedPreferences;
    public static final String mypreference = "mypref";
    public static final String BuddyMove = "moveKey";
    private static final String PREFS_NAME = "logPreferences";
    private static final String LOG_KEY = "logs";
    Move(final float aSpeed, final float aDistance, final Action aNextAction) {
        this.speed = aSpeed;
        this.distance = aDistance;
        this.nextAction = aNextAction;
    }
    @Override
    public void perform() {
        LogPreferences logPreferences = new LogPreferences();
       // logPreferences.addLog("INFO", "Read to perform move action");
       // logPreferences.addLog("ERROR", "An unexpected error occurred"); // just an example.
        // Retrieving all logs
       // Queue<String> allLogs = logPreferences.retrieveAllLogs();
        //for (String log : allLogs) {
       // //    System.out.println(log);
       // }

        // Deleting all logs
      //  logPreferences.deleteAllLogs();

        // Verifying deletion
       // allLogs = logPreferences.retrieveAllLogs();
       // if (allLogs.isEmpty()) {
       //     System.out.println("All logs have been deleted.");
       // }

        es=new ExecutionStatus();

        EnableWheels ew=new EnableWheels(true,null);
        ew.perform();
        BuddySDK.USB.moveBuddy(this.speed, this.distance, new IUsbCommadRsp.Stub() {
            @Override
            public void onSuccess(final String s) throws RemoteException {
                Log.i("MOVE_STATUS",s);
                if (s.toUpperCase().contains("WHEEL_MOVE_FINISHED")) {
                    sharedPreferences = MainActivity.getContext().getSharedPreferences(mypreference, Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    editor.putString(BuddyMove, "MOVE_FINISHED");
                    editor.commit();
                    Log.i("MOVE_STATUS",s);
                   // es.changeExecutionStatus("MOVE_STATUS",s);

                    Log.i("NEXT_ACTION",nextAction.toString());
                    if (nextAction != null) {
                        nextAction.perform();
                    }
                }

            }

            @Override
            public void onFailed(final String s) throws RemoteException {
                sharedPreferences = MainActivity.getContext().getSharedPreferences(mypreference, Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString(BuddyMove, "MOVE_FAILED");
                editor.commit();
            }
        });

    }
}
