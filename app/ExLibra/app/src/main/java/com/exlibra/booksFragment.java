package com.exlibra;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class booksFragment extends Fragment {

    Spinner dropdown;
    EditText bookPrice;
    TextInputEditText bookDesc;
    Button submit;

    private OnFragmentInteractionListener mListener;

    FirebaseFirestore db;
    FirebaseUser usr;

    int selectedBook = 0;
    ArrayList<Object> bookReferences = new ArrayList<>();
    ArrayList<String> bookNames = new ArrayList<>();
    ArrayAdapter<String> adapter;

    //constructor
    public booksFragment() {
    }

    public static booksFragment newInstance(String param1, String param2) {
        booksFragment fragment = new booksFragment();
        Bundle args = new Bundle();

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_books, container, false);
        Log.e("books", "fragment onCreateView");

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        db = FirebaseFirestore.getInstance();
        usr = FirebaseAuth.getInstance().getCurrentUser();

        dropdown = getActivity().findViewById(R.id.dropdown_books);
        bookPrice = getActivity().findViewById(R.id.book_price);
        bookDesc = getActivity().findViewById(R.id.book_description);
        submit = getActivity().findViewById(R.id.submit);

        bookReferences.add(null);
        bookNames.add("Select a book...");

        CollectionReference cr_books = db.collection("/books");
        cr_books.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful())
                    return;

                for (QueryDocumentSnapshot doc : task.getResult()) {
                    bookReferences.add(doc.getReference());
                    bookNames.add(doc.getString("ime"));
                }
                // Fill up spinner/dropdown menu
                adapter = new ArrayAdapter<String>(getActivity(), android.R.layout.simple_spinner_item, bookNames);
                dropdown.setAdapter(adapter);
            }
        });

        // Keep track of the selected book
        dropdown.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                selectedBook = i;
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                selectedBook = 0;
            }
        });


        // On Click, check for structure, display message
        submit.setOnClickListener(view1 -> {
            String price = bookPrice.getText().toString();
            double priceDouble;
            String desc = bookDesc.getText().toString();

            if (TextUtils.isEmpty(price)){
                bookPrice.setError("Price cannot be empty.");
                bookPrice.requestFocus();
                return;
            } else if (TextUtils.isEmpty(desc)) {
                bookDesc.setError("Description cannot be empty.");
                bookDesc.requestFocus();
                return;
            } else if (selectedBook == 0){
                Toast.makeText(getActivity(), "A book must be selected.", Toast.LENGTH_SHORT).show();
                dropdown.requestFocus();
                return;
            }
            try{
                priceDouble = Double.parseDouble(bookPrice.getText().toString());
            }catch (Exception e){
                Toast.makeText(getActivity(), "Price must be a decimal number, separated by a dot.", Toast.LENGTH_SHORT).show();
                return;
            }

            // postaj oglas
            // knjiga, prodajalec(do)
            HashMap<String, Object> oglas = new HashMap<>();
            oglas.put("cena", priceDouble);
            oglas.put("datum", FieldValue.serverTimestamp());
            oglas.put("opis", desc);
            oglas.put("prodano", false);
            oglas.put("urlslike", "https://firebasestorage.googleapis.com/v0/b/exlibra-563bd.appspot.com/o/slikaoglasa%2FAexwSBocf8fymMBojbXoaxcAnuA3%2Funnamed.png?alt=media&token=849d659f-24d8-45bd-a5d3-e1222a81d06c"); // default pic
            oglas.put("knjiga", bookReferences.get(selectedBook));
            oglas.put("prodajalec", usr.getUid());

            DocumentReference dr_ads = db.collection("/oglas").document();
            dr_ads.set(oglas).addOnCompleteListener(task -> {
                // also add the ad to users ad list
                DocumentReference dr_users = db.collection("/users").document(usr.getUid());
                dr_users.get().addOnCompleteListener(task1 -> {
                    Map<String, Object> me = task1.getResult().getData();
                    ArrayList<String> myAds = (ArrayList<String>) me.get("ads");
                    myAds.add(dr_ads.getId());
                    me.put("ads", myAds);
                    db.collection("users").document(usr.getUid()).set(me).addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void unused) {
                            // Display message and clear all fields
                            Toast.makeText(getActivity(), "Ad successfully posted.", Toast.LENGTH_SHORT).show();
                            dropdown.setSelection(0);
                            bookPrice.setText("");
                            bookDesc.setText("");
                        }
                    });
                });
            });

        });


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
