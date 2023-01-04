package com.exlibra;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class booksFragment extends Fragment {

    //boilerplate attributes and methods
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private OnFragmentInteractionListener mListener;

    static FirebaseFirestore db;

    ListView list;
    ArrayList<Object> items = new ArrayList<>();

    //constructor
    public booksFragment() {
    }

    public static booksFragment newInstance(String param1, String param2, FirebaseFirestore dbarg) {
        booksFragment fragment = new booksFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        db = dbarg;
        Log.e("DEBUG", db.toString());
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
        View view = inflater.inflate(R.layout.fragment_books, container, false);
        Log.e("books", "fragment onCreateView");
        //initialise add book floating action button

        //on click listener
        View.OnClickListener addClick = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Intent intent = new Intent(getActivity(), scanBookActivity.class);
                //startActivity(intent);
            }
        };

        //Google AUTH je delal probleme tukaj
        //initialise recycle view
        //getScannedBookTitles(view);
        //getRentedBookTitles(view);
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        list = getView().findViewById(R.id.list);
        //for (int i = 0; i < 30; i++)
        //  items.add("Item: "+i);

        CollectionReference cr = db.collection("/oglas");
        cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful()) {
                    Log.e("ERRorrrrrrr", task.getException().toString());
                    return;
                }
                for (QueryDocumentSnapshot doc : task.getResult()) {
                    Log.d("DATAAAaaaaaa", doc.getData().toString());

                    Map<Object, Object> oglas = new HashMap<>();
                    oglas.put("prodano", false);
                    oglas.put("cena", doc.get("cena"));
                    oglas.put("opis", doc.get("opis"));

                    Log.e("DEBUG", doc.get("prodajalec")+"");
                    //Object user =db.collection("/users").document( doc.get("prodajalec").toString() ).get("");
                    //Log.e("DEBUG", user.toString());

                    items.add(oglas);

                }

                ArrayAdapter<Object> adapter = new ArrayAdapter<Object>(getActivity(), android.R.layout.simple_list_item_1, items);
                list.setAdapter(adapter);

            }
        });

        /*
        Log.e("DEBUG", items.size()+"");
        ArrayAdapter<Object> adapter = new ArrayAdapter<Object>(getActivity(), android.R.layout.simple_list_item_1, items);
        list.setAdapter(adapter);
        */



    }

    private void getRentedBookTitles(final View view) {
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        final String userID = user.getUid();
        db.collection("books").whereEqualTo("rentingID", userID).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    ArrayList<book> books = new ArrayList<>();
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        book book = document.toObject(com.exlibra.book.class);
                        book.setFirestoreID(document.getId());
                        books.add(book);
                    }
                    if (books.size() == 0) {
                        books.add(new book(null, null, null, null, "rent a book", null, false, false, null));
                    }
                    initRentingBooksRecylerView(view, books);
                }
            }
        });
    }

    //method to get all books
    private void getScannedBookTitles(final View view) {
        //initialise firestore connection
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        final String userID = user.getUid();
        //get all associated books
        db.collection("books").whereEqualTo("ownerReference", userID).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful()) {
                    ArrayList<book> books = new ArrayList<>();
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        book book = document.toObject(book.class);
                        book.setFirestoreID(document.getId());
                        books.add(book);
                    }
                    //single book class to indicate no books have been added yet
                    if (books.size() == 0) {
                        books.add(new book(null, null, null, null, "add a book", null, false, false, null));
                    }
                    //initialise recycle view
                    initScannedBooksRecyclerView(view, books);
                }
            }
        });
    }

    //method to initialise recycle view
    private void initScannedBooksRecyclerView(View view, ArrayList<book> books) {
        //RecyclerView recyclerView = view.findViewById(R.id.scannedBooksView);
        //scannedBooksRecyclerViewAdapter adapter = new scannedBooksRecyclerViewAdapter(getContext(), books);
        //recyclerView.setAdapter(adapter);
        //recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
    }

    private void initRentingBooksRecylerView(View view, ArrayList<book> books) {
        //RecyclerView recyclerView = view.findViewById(R.id.rentingBooksView);
        //rentingBooksRecyclerViewAdapter adapter = new rentingBooksRecyclerViewAdapter(getContext(), books);
        //recyclerView.setAdapter(adapter);
        //recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
    }

    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
