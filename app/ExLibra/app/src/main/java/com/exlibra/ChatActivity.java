package com.exlibra;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;


public class ChatActivity extends AppCompatActivity implements AdapterView.OnItemClickListener{

    static String selectedGroupId;

    String TAG = "DEBUG";
    ListView list;
    TextView nochats;

    ArrayList<String> groupIds = new ArrayList<>();
    ArrayList<String> groupIds_ordered = new ArrayList<>();
    ArrayList<String> usernames = new ArrayList<>();
    HashMap<String, String> userId_userName = new HashMap<>();

    Context chatActivityContext;

    @Override
    protected void onCreate(Bundle savedInstanceState)  {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        list = findViewById(R.id.list);
        list.setOnItemClickListener(this);
        nochats = findViewById(R.id.nochats);

        chatActivityContext = this;
        getUserChatGroups();

    }


    public void getUserChatGroups(){
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();
        String myUserId = FirebaseAuth.getInstance().getUid();
        nochats.setVisibility(View.GONE);
        CollectionReference cr = db.collection("/users");
        cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                for (DocumentSnapshot doc : task.getResult().getDocuments()) {
                    userId_userName.put(doc.getId(), doc.getString("username"));
                    if (doc.getId().equals(usr.getUid())) { // that's me
                        groupIds = (ArrayList<String>) doc.get("groups");
                        Log.e(TAG, "my groups are "+groupIds);
                    }
                }

                CollectionReference cr = db.collection("/group");
                cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        for (DocumentSnapshot doc : task.getResult().getDocuments()) {
                            if (groupIds.contains(doc.getId())){
                                groupIds_ordered.add(doc.getId());
                                ArrayList<String> members = (ArrayList<String>) doc.get("members");
                                Log.e(TAG, "found members: "+members);
                                if (members.get(0).equals(usr.getUid())) // if it's me
                                    usernames.add( userId_userName.get(members.get(1)) );
                                else
                                    usernames.add( userId_userName.get(members.get(0)) );
                                Log.e(TAG, "added to usernames: "+usernames.get(usernames.size()-1) );
                            }
                        }
                        String[] usernamesString = makeStringArray(usernames);
                        ChatAdapter chatAdapter = new ChatAdapter(chatActivityContext, usernamesString);
                        Log.e(TAG, "adapter has "+chatAdapter.usernames.length+" usernames");
                        list.setAdapter(chatAdapter);
                        if (usernamesString.length == 0) {
                            Toast.makeText(getApplicationContext(), "No active chats found.", Toast.LENGTH_LONG).show();
                            nochats.setVisibility(View.VISIBLE);
                        }
                    }
                });
            }
        });
    }

    // Helper methods
    int[] makeIntArray(ArrayList<Integer> arrList){
        int[] arr = new int[arrList.size()];
        for (int i=0; i<arrList.size(); i++) {
            arr[i] = (int)arrList.get(i);
        }
        return arr;
    }
    String[] makeStringArray(ArrayList<String> arrList){
        String[] arr = new String[arrList.size()];
        for (int i=0; i<arrList.size(); i++) {
            arr[i] = (String)arrList.get(i);
        }
        return arr;
    }


    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
        Log.e(TAG, "onItemClick: CLICKED "+position);
        Log.d(TAG, "GID = "+groupIds_ordered.get(position));

        Intent i = new Intent(ChatActivity.this, SpecificChatActivity.class);
        i.putExtra("gid", groupIds_ordered.get(position));
        i.putExtra("hisUsername", usernames.get(position));
        startActivity(i);
    }
}

// Helper classes for displaying an image and username as a list item
class ChatAdapter extends ArrayAdapter<String>{
    Context context;
    String[] usernames;

    public ChatAdapter(Context context, String[] usernames){
        super(context, R.layout.chat_item, R.id.chatText, usernames);
        this.context = context;
        this.usernames = usernames;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View singleItem = convertView;
        ChatViewHolder holder = null;
        if (singleItem == null){
            LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            singleItem = layoutInflater.inflate(R.layout.chat_item, parent, false);
            holder = new ChatViewHolder(singleItem);
            singleItem.setTag(holder);
        } else {
            holder = (ChatViewHolder) singleItem.getTag();
        }
        //holder.userImage.setImageResource( images[position] );
        //new DownloadImageTask(holder.userImage).execute( images[position] );

        holder.username.setText(usernames[position]);
        return super.getView(position, convertView, parent);
    }

}

class ChatViewHolder {

    TextView username;
    ChatViewHolder(View v) {
        username = v.findViewById(R.id.chatText);
    }
}





