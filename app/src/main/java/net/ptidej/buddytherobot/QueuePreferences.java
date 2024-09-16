package net.ptidej.buddytherobot;

import android.util.Log;

import java.util.LinkedList;
import java.util.Queue;

public class QueuePreferences {
    Queue<String> queue = new LinkedList<>();
    public void enqueue(String value) {
        Log.i("QUEUE:::", value);
        queue.add(value);
    }
    public String dequeue() {
        String nextItem=null;
        try {
            nextItem = queue.remove();

        }catch(Exception e){
            Log.i("QUEUE ERROR:::", e.toString());
        }
        return nextItem;
    }


    public String loadQueue() {
        Log.i("QUEUE:::",queue.toString());
        return queue.toString();
    }
}
