package com.exlibra;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QuerySnapshot;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SpecificChatActivity extends AppCompatActivity {

    String TAG = "DEBUG";

    String groupId;
    String hisUsername;

    ListView list;
    ArrayAdapter<String> adapter;
    String myEmail;
    String myUsername;

    FirebaseFirestore db;
    FirebaseUser usr;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_specific_chat);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            groupId = extras.getString("gid");
            hisUsername = extras.getString("hisUsername");
        }

        setTitle(hisUsername);

        list = findViewById(R.id.chatList);

        db = FirebaseFirestore.getInstance();
        usr = FirebaseAuth.getInstance().getCurrentUser();
        myEmail = usr.getEmail();
        getMyUsername();

        ImageButton sendButton = findViewById(R.id.sendButton);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EditText messageInput = (EditText) findViewById(R.id.messageInput);
                String input = messageInput.getText().toString();
                messageInput.setText("");
                if (input.equals(""))
                    return;
                ArrayList<String> arrayList = new ArrayList<>();
                if (list.getAdapter() == null) {
                    adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, arrayList); // simple_spinner
                }else{
                    adapter = (ArrayAdapter<String>) list.getAdapter();
                }

                //shraniš
                myEmail = usr.getEmail();

                CollectionReference messageCollection = db.collection("/group").document(groupId).collection("/messages");
                Map<String, Object> messageObject = new HashMap<>();
                messageObject.put("sentBy", myUsername);
                messageObject.put("messageText", input);
                messageObject.put("sentAt", FieldValue.serverTimestamp());

                messageCollection.add(messageObject);

                // izpišeš
                String line = myEmail+" (now)"+":\n"+input;
                adapter.add(line);
                list.setAdapter(adapter);
            }

        });

        // Listens for chat updates, almost in real time (very close)
        db.collection("/group").document(groupId).collection("/messages").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error != null) {
                    Log.e(TAG, "listen:error", error);
                    return;
                }

                for (DocumentChange dc : value.getDocumentChanges()) {
                    Log.e(TAG, "Document Change: "+dc.getType());
                    if (dc.getType() != DocumentChange.Type.ADDED){
                        getChatWithUser(groupId);
                        return;
                    }
                    Map<String, Object> data = dc.getDocument().getData();
                    String line = data.get("sentBy")+" (now)"+":\n" +
                            data.get("messageText");

                    if (adapter == null) return;
                    adapter.add(line);
                }
                list.setAdapter(adapter);
            }
        });

        // fill the chat with preexisting messages
        getChatWithUser(groupId);
    }


    void getMyUsername(){
        db.collection("users").document(usr.getUid()).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (!task.isSuccessful()) return;
                myUsername = task.getResult().getString("username");
            }
        });
    }


    /**
     * Gets all messages (in order) from Firebase and displays them in a ListView
     * @param groupId An Id of the group you'd like to display messages from
     */
    private void getChatWithUser(String groupId) {
        CollectionReference cr = db.collection("/group").document(groupId).collection("/messages");
        cr.orderBy("sentAt").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful()){
                    Log.e("ERROR", "Error while trying to decompose chat group");
                    return;
                }

                ArrayList<String> messagesArrayList = new ArrayList<>();
                ListView list = findViewById(R.id.chatList);
                adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, messagesArrayList);

                for (DocumentSnapshot message : task.getResult().getDocuments() ) {
                    Date timestamp = ((Timestamp)(message.get("sentAt"))).toDate();
                    String time;
                    try {
                        String[] splitTime = timestamp.toString().split(" ");
                        time = " ("+splitTime[3]+")";
                    }catch (Exception e){
                        Log.e(TAG, "Error while converting timestamp");
                        time = "";
                    }
                    String line = message.getString("sentBy")+time+":\n" +
                            message.getString("messageText");

                    adapter.add(line);
                }
                // Actually displays messasges in app
                list.setAdapter(adapter);
            }
        });

    }


}