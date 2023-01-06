package com.exlibra;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

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

public class ChatActivity extends AppCompatActivity implements AdapterView.OnItemClickListener, homeFragment.OnFragmentInteractionListener, booksFragment.OnFragmentInteractionListener, chatFragment.OnFragmentInteractionListener{

    static String selectedGroupId;

    String TAG = "DEBUG";
    ListView list;
    ArrayList<String> groupIds = new ArrayList<>();

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
        Log.e(TAG, "CALLING");
        getUserChatGroups();
    }


    public void getUserChatGroups(){

        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();
        String myEmail = usr.getEmail();
        String userid = "VMkMvxWBpwabIUoiIww0To1EKlh1"; //FirebaseAuth.getInstance().getUid();

        Log.e(TAG, "userid: "+userid);
        CollectionReference cr = db.collection("/group");
        cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful())
                    return;
                ArrayList<String> groupsArrayList = new ArrayList<>();
                ListView list = findViewById(R.id.list);
                ArrayAdapter<String> adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, groupsArrayList);
                for (DocumentSnapshot doc: task.getResult().getDocuments()) {
                    ArrayList<String> documentMembers = (ArrayList<String>) doc.get("members");
                    if (documentMembers.size()<2) continue;
                    Log.e(TAG, "members: "+documentMembers.get(0)+", "+documentMembers.get(1) );
                    if (documentMembers.get(0).equals(userid) || (documentMembers.get(1).equals(userid))){
                        String gid = doc.getId();
                        groupIds.add(gid);
                        // get name of the other guy,
                        // and the last message sent, preferably
                        adapter.add(gid);
                    }
                }
                list.setAdapter(adapter);

            }
        });




    }



    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
        Log.d(TAG, "CLicked: "+position);
        Log.d(TAG, "GID = "+groupIds.get(position));
        // Create chat Fragment
        Intent i = new Intent(ChatActivity.this, SpecificChatActivity.class);
        i.putExtra("gid", groupIds.get(position));
        startActivity(i);

    }
}