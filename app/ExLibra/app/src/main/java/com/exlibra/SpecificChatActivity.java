package com.exlibra;

import androidx.annotation.NonNull;
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
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SpecificChatActivity extends AppCompatActivity {

    String TAG = "DEBUG";

    static String groupId;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_specific_chat);

        Bundle extras = getIntent().getExtras();
        if (extras != null)
            groupId = extras.getString("gid");

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

                ArrayList<String> arrayList = new ArrayList<>();
                ListView list = findViewById(R.id.chatList);
                ArrayAdapter<String> adapter;
                if (list.getAdapter() == null) {
                    adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_spinner_item, arrayList);
                }else{
                    adapter = (ArrayAdapter<String>) list.getAdapter();
                }

                //shraniš
                final FirebaseFirestore db = FirebaseFirestore.getInstance();
                final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();
                String myEmail = usr.getEmail();

                CollectionReference messageCollection = db.collection("/group").document(groupId).collection("/messages");

                Map<String, Object> messageObject = new HashMap<>();
                messageObject.put("sentBy", myEmail);
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

    }


    //method to get and display search results
    private void getChatWithUser(String groupId) {
        //initialise firestore connection
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();
        //String myEmail = usr.getEmail();

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
                ArrayAdapter<String> adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, messagesArrayList);

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