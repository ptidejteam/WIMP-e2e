package net.ptidej.buddytherobot;

import android.util.Log;

import java.util.LinkedList;
import java.util.Queue;

public class LogPreferences {
    Queue<LogEntry> queue = new LinkedList<>();
    public void enqueue(LogEntry value) {
        Log.i("Log:::", value.toString());
        queue.add(value);
    }
    public String logQueue() {
        StringBuilder logs=new StringBuilder();
        if (queue.isEmpty()) {
        Log.i("QUEUE","No logs");
        } else {
            for (LogEntry element : queue) {
              logs.append(element.TAG+":"+element.message);
            }
        }
        return logs.toString();
    }
}
class LogEntry{
    String TAG;
    String message;
    public LogEntry(String TAG,String message){
        this.TAG=TAG;
        this.message=message;
    }
    public String toString(){
        return TAG+":"+message;
    }
}