package com.exlibra;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;


public class chatFragment extends Fragment {

    //initialise boilerplate attributes and methods
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private ArrayList<book> bookList = new ArrayList<>();
    private OnFragmentInteractionListener mListener;

    String TAG = "DEBUG";

    //constructor
    public chatFragment() {
    }

    public static chatFragment newInstance(String param1, String param2) {
        chatFragment fragment = new chatFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        Log.e("chat", "fragment newInstance");
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            String mParam1 = getArguments().getString(ARG_PARAM1);
            String mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        Log.e("chat", "fragment newInstance");
        final View view = inflater.inflate(R.layout.fragment_chat, container, false);
        //initialise ui components
        ///inal EditText searchInput = view.findViewById(R.id.search);

        getChatWithUser();

        //initialise on click event
        View.OnClickListener clickEvent = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.e("DEBUG","DIO PORCO CANE");
                //call get search results method
                //getSearchResults(searchInput.getText().toString(), view);
            }
        };
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        ImageButton sendButton = getView().findViewById(R.id.sendButton);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EditText messageInput = (EditText) getView().findViewById(R.id.messageInput);
                String input = messageInput.getText().toString();
                messageInput.setText("");
                if (!input.equals("")) {

                    ArrayList<String> arrayList = new ArrayList<>();
                    ListView list = getView().findViewById(R.id.chatList);
                    ArrayAdapter<String> adapter;
                    if (list.getAdapter() == null) {
                        adapter = new ArrayAdapter<String>(getActivity(), android.R.layout.simple_spinner_item, arrayList);
                    }else{
                        adapter = (ArrayAdapter<String>) list.getAdapter();
                    }

                    adapter.add(input);
                    list.setAdapter(adapter);
                    System.out.println(adapter.getCount());
                }
            }
        });
    }

    //method to get and display search results
    private void getChatWithUser() {
        //initialise firestore connection
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser();
        String myEmail = usr.getEmail();
        Log.e("DEBUG", "i am "+usr.getEmail());

        CollectionReference cr = db.collection("/group").document("x8wflwkjpKEVTUx3zuGa").collection("/messages");
        // at this point we should already know the group, group is given by a chat-group-list activity, when you choose which group you want to chat
        String chatGroup = "x8wflwkjpKEVTUx3zuGa/messages";
        Log.d(TAG, "document: "+cr);
        Object user = cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful()){
                    Log.e("ERROR", "Error while trying to decompose chat group");
                    return;
                }
                for (DocumentSnapshot x : task.getResult().getDocuments()) {
                    Log.d(TAG, "message: "+x.getString("messageText"));
                    Log.i(TAG, "sentBy: "+x.getString("sentBy"));
                }



                // Let's say we have the other mail, the person we're talking to.
                // This is strictly for finding a group, each message has a "sentBy" field
                String otherEmail = "other.person@gmail.com";



            }
        });

        //query all documents on the market with the input isbn
        //db.collection("books").whereEqualTo("isbn", input).whereEqualTo("market", true).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
        // });



    }


    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }



    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }


}
