package com.exlibra;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

public class ChatActivity extends AppCompatActivity implements AdapterView.OnItemClickListener{

    static String selectedGroupId;

    String TAG = "DEBUG";
    ListView list;
    ArrayList<String> groupIds = new ArrayList<>();
    ArrayList<String> userIds = new ArrayList<>();
    ArrayList<String> usernames = new ArrayList<>();
    ArrayList<Integer> userImages = new ArrayList<Integer>();

    Context chatActivityContext;

    @Override
    protected void onCreate(Bundle savedInstanceState)  {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        list = findViewById(R.id.list);
        list.setOnItemClickListener(this);

        /*
        //initialise bottom navigation
        BottomNavigationView navigation = findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
        navigation.setSelectedItemId(R.id.action_chat);
        */
        chatActivityContext = this;
        getUserChatGroups();
    }


    public void getUserChatGroups(){
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();
        String myEmail = usr.getEmail();
        String myUserId = FirebaseAuth.getInstance().getUid();
        Log.e(TAG, "userid: "+myUserId);
        CollectionReference cr = db.collection("/group");
        cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful())
                    return;
                //ArrayList<String> groupsArrayList = new ArrayList<>();
                //ListView list = findViewById(R.id.list);
                //ArrayAdapter<String> adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, groupsArrayList);
                for (DocumentSnapshot doc: task.getResult().getDocuments()) {
                    ArrayList<String> documentMembers = (ArrayList<String>) doc.get("members");
                    if (documentMembers.size()<2) continue;
                    //Log.e(TAG, "Members: "+documentMembers.get(0)+" "+documentMembers.get(1)+", i am "+myUserId);
                    if (documentMembers.get(0).equals(myUserId) || (documentMembers.get(1).equals(myUserId))) {
                        String gid = doc.getId();
                        groupIds.add(gid);
                        //Log.e(TAG, "Have group "+gid );
                        String otherUserid = documentMembers.get(0).equals(myUserId) ? documentMembers.get(1) : documentMembers.get(0);
                        userIds.add( otherUserid );
                        //Log.e(TAG, "Added "+ otherUserid);
                    }
                }
                //Log.e(TAG, "gonna start checking: "+userIds.size()  );
                db.collection("/users").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        for (DocumentSnapshot doc : task.getResult().getDocuments()) {
                            if (userIds.contains(doc.getId())) {
                                usernames.add(doc.getString("username"));
                                userImages.add(R.drawable.ic_person_24dp);
                                //Log.d(TAG, "Added: "+doc.getString("username"));
                            }
                        }
                        //Log.e("CHAT", "usernames is "+usernames.size());
                        //adapter.addAll(usernames);
                        // If empty, we should display a message on how to start chatting, or something like that

                        int[] userImagesInt = makeIntArray(userImages);
                        String[] usernamesString = makeStringArray(usernames);
                        ChatAdapter chatAdapter = new ChatAdapter(chatActivityContext, usernamesString, userImagesInt);

                        Log.e(TAG, "adapter has "+chatAdapter.images.length+" images");
                        Log.e(TAG, "adapter has "+chatAdapter.usernames.length+" usernames");

                        list.setAdapter(chatAdapter);  // adapter
                    }
                });

            }
        });

    }

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
        Log.d(TAG, "GID = "+groupIds.get(position));

        Intent i = new Intent(ChatActivity.this, SpecificChatActivity.class);
        i.putExtra("gid", groupIds.get(position));
        startActivity(i);
    }
}

// Helper classes for displaying an image and username as a list item

class ChatAdapter extends ArrayAdapter<String>{
    Context context;
    int[] images;
    String[] usernames;

    public ChatAdapter(Context context, String[] usernames, int[]images){
        super(context, R.layout.chat_item, R.id.chatText, usernames);
        this.context = context;
        this.images = images;
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
        holder.userImage.setImageResource(images[position]);
        holder.username.setText(usernames[position]);
        Log.e("ProgramAdapter", "adapter has "+usernames[position] );
        return super.getView(position, convertView, parent);
    }

}

class ChatViewHolder {
    ImageView userImage;
    TextView username;
    ChatViewHolder(View v) {
        userImage = v.findViewById(R.id.chatImage);
        username = v.findViewById(R.id.chatText);
    }
}


