package com.exlibra;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
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

    static String groupId;

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
        if (extras != null)
            groupId = extras.getString("gid");

        list = findViewById(R.id.chatList);

        db = FirebaseFirestore.getInstance();
        usr = FirebaseAuth.getInstance().getCurrentUser();
        myEmail = usr.getEmail();
        getUsername();

        getChatWithUser(groupId);

        ImageButton sendButton = findViewById(R.id.sendButton);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EditText messageInput = (EditText) findViewById(R.id.messageInput);
                String input = messageInput.getText().toString();
                messageInput.setText("");
                if (input.equals(""))
                    return;

                Log.e(TAG, "USER SENT BY"+myUsername );


                ArrayList<String> arrayList = new ArrayList<>();

                if (list.getAdapter() == null) {
                    adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_spinner_item, arrayList);
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

                Object timestamp = (FieldValue.serverTimestamp());
                String time;
                try {
                    time = " ("+timestamp.toString().split(" ")[3]+")";
                }catch (Exception e){
                    Log.e(TAG, "got "+ timestamp.toString() );
                    Log.e(TAG, e.toString());
                    time = " (now)";
                }

                // izpišeš
                String line = myEmail+time+":\n"+input;
                adapter.add(line);
                list.setAdapter(adapter);

            }

        });

        // Listens for chat updates
        db.collection("/group").document(groupId).collection("/messages").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error != null) {Log.w(TAG, "listen:error", error); return;}

                for (DocumentChange dc : value.getDocumentChanges()) {
                    if (dc.getType() != DocumentChange.Type.ADDED){
                        getChatWithUser(groupId);
                        return;
                    }
                    Log.e(TAG, "UPDATE: "+dc.getDocument().getData() );
                    Map<String, Object> data = dc.getDocument().getData();

                    String line = data.get("sentBy")+" (now)"+":\n" +
                            data.get("messageText");

                    if (adapter == null) return;
                    adapter.add(line);
                }
                list.setAdapter(adapter);

            }
        });


    }


    void getUsername(){
        db.collection("users").document(usr.getUid()).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (!task.isSuccessful()) return;
                myUsername = task.getResult().getString("username");
                Log.e(TAG, "USERNAME "+myUsername );
            }
        });
    }


    //method to get and display search results
    private void getChatWithUser(String groupId) {
        //initialise firestore connection
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();

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
                        time = " ("+timestamp.toString().split(" ")[3]+")";
                    }catch (Exception e){
                        time = "";
                    }
                    String line = message.getString("sentBy")+time+":\n" +
                            message.getString("messageText");

                    adapter.add(line);
                }
                // Actually displays messasges inapp
                list.setAdapter(adapter);
            }
        });

    }




}