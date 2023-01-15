package com.exlibra;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class homeFragment extends Fragment implements AdapterView.OnItemClickListener{

    //initialise boilerplate attributes and methods
    private static String Name = "param1";
    private static String Mail = "param2";
    String TAG = "DEBUG";

    ListView list;
    Context fragContext;

    // =========== List Data Structure (and helper variables) ===============
    ArrayList<String> groupIds = new ArrayList<>();
    HashMap<String, String> bookIds_bookNames = new HashMap<>();
    ArrayList<String> adBookNames = new ArrayList<>();
    ArrayList<Double> adPrices = new ArrayList<>();
    ArrayList<String> userIds = new ArrayList<>();
    HashMap<String, String> userIds_userNames = new HashMap<>();
    ArrayList<String> adSellers = new ArrayList<>();
    ArrayList<String> adDescs = new ArrayList<>();

    ArrayAdapter<String> classicAdapter;

    boolean finish1 = false;
    boolean finish2 = false;
    // =============== End of List Data Structures =================

    FirebaseFirestore db;
    FirebaseUser usr;

    private OnFragmentInteractionListener mListener;


    public homeFragment() {
    }

    public static homeFragment newInstance(String param1, String param2) {
        homeFragment fragment = new homeFragment();
        Bundle args = new Bundle();

        //fragment.setArguments(args);

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Log.e("home", "fragment onCreateView");
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        db = FirebaseFirestore.getInstance();
        usr = FirebaseAuth.getInstance().getCurrentUser();

        Log.e(TAG, "onCreate: " + getView());
        list = getView().findViewById(R.id.adList);
        list.setOnItemClickListener(this);

        getAds();

    }

    /**
     * Gets all ads from Firebase and fills the ListView with them.
     * Along with all ads, corresponding usernames and booknames are pulled.
     */
    public void getAds(){
        CollectionReference cr_users = db.collection("/users");
        cr_users.get().addOnCompleteListener(task -> {
            // map user id to username
            for (DocumentSnapshot doc : task.getResult().getDocuments())
                userIds_userNames.put(doc.getId(), doc.getString("username"));

            CollectionReference cr_ads = db.collection("/oglas");
            cr_ads.get().addOnCompleteListener(task1 -> {
                int numOfAds = task1.getResult().size();
                for (DocumentSnapshot doc : task1.getResult().getDocuments()) { // go through all ads
                    ((DocumentReference)doc.get("knjiga")).get().addOnCompleteListener(task2 -> {
                        userIds.add(doc.getString("prodajalec"));
                        adSellers.add( userIds_userNames.get(doc.getString("prodajalec")));
                        adPrices.add(doc.getDouble("cena"));
                        adDescs.add(doc.getString("opis"));
                        adBookNames.add( task2.getResult().getString("ime") );
                        if (adBookNames.size() >= numOfAds)
                            fillList();
                    });
                }
            });
        });
    }

    void fillList(){
        ArrayList lines = new ArrayList<>();
        for (int i = 0; i < adBookNames.size(); i++) {
            String line = adBookNames.get(i) + "\n" +
                    adSellers.get(i) + "\n" +
                    adPrices.get(i) + "€\n" +
                    adDescs.get(i);
            lines.add(line);
        }
        classicAdapter = new ArrayAdapter<String>(fragContext, android.R.layout.simple_list_item_1, lines);

        list.setAdapter(classicAdapter);
    }



    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        fragContext = context;
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


    /**
     * On click, triggers a group chat pipeline.
     * Checks if a groupchat with user already exists
     * If yes, switch to that
     * Otherwise, create a group, add it to both users, jump to it
    */
    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
        Log.e(TAG, "user: "+adSellers.get(i)+": "+userIds.get(i) );
        makeMyGroups(usr.getUid(), i);
    }
    ArrayList tempArrayList;
    void makeMyGroups(String myId, int hisI){
        if (myId.equals(userIds.get(hisI))){
            Toast.makeText(getActivity(), "You own this ad.", Toast.LENGTH_SHORT).show();
            return;
        }

        db.collection("users").document(myId).get().addOnCompleteListener(task -> {
            tempArrayList =  (ArrayList)task.getResult().get("groups");
            String[] myGroups = makeStringArray(tempArrayList);
            printArray(myGroups);
            makeHisGroups(hisI, myGroups);
        });
    }

    void makeHisGroups(int hisI, String[] myGroups){
        db.collection("users").document(userIds.get(hisI)).get().addOnCompleteListener(task -> {
            tempArrayList =  (ArrayList)task.getResult().get("groups");
            String[] hisGroups = makeStringArray(tempArrayList);
            printArray(hisGroups);
            compareGroups(myGroups, hisGroups, hisI);
        });
    }

    void compareGroups(String[] myGroups, String[] hisGroups, int hisI){
        boolean matched = false;
        String matchingGroup = "";
        for (int j = 0; j < hisGroups.length; j++) {
            for (int k = 0; k < myGroups.length; k++) {
                if (hisGroups[j].equals(myGroups[k])) {
                    matchingGroup = hisGroups[j];
                    matched = true;
                    break;
                }
            }
        }
        if (matched)
            startChatIntent(matchingGroup, hisI);
        else
            makeNewChatGroup(hisI);
    }

    void makeNewChatGroup(int hisI){
        Map<String, Object> group = new HashMap<String, Object>();
        group.put("createdAt", FieldValue.serverTimestamp());
        ArrayList<String> members = new ArrayList<>();
        members.add(userIds.get(hisI));
        members.add(usr.getUid());
        group.put("members", members);
        DocumentReference df =  db.collection("group").document();
        df.set(group).addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void unused) {
                setMyGroup(df.getId(), hisI);
            }
        });

    }

    void setMyGroup(String gid, int hisI){
        db.collection("users").document(usr.getUid()).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                Map<String, Object> me = task.getResult().getData();
                ArrayList<String> myGroups = (ArrayList<String>) me.get("groups");
                myGroups.add(gid);
                me.put("groups", myGroups);
                db.collection("users").document(usr.getUid()).set(me).addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void unused) {
                        setHisGroup(gid, hisI);
                    }
                });
            }
        });

    }

    void setHisGroup(String gid, int hisI){
        db.collection("users").document(userIds.get(hisI)).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                Map<String, Object> me = task.getResult().getData();
                ArrayList<String> myGroups = (ArrayList<String>) me.get("groups");
                myGroups.add(gid);
                me.put("groups", myGroups);
                db.collection("users").document(userIds.get(hisI)).set(me).addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void unused) {
                        startChatIntent(gid, hisI);
                    }
                });
            }
        });

    }

    void startChatIntent(String gid, int hisI){
        Intent intent = new Intent(getActivity(), SpecificChatActivity.class);
        intent.putExtra("gid", gid);
        intent.putExtra("hisUsername", adSellers.get(hisI));
        startActivity(intent);
    }
    // ================== End of group chat pipeline ===================


    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }



    // HELPER METHODS
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
    double[] makeDoubleArray(ArrayList<Double> arrList){
        double[] arr = new double[arrList.size()];
        for (int i=0; i<arrList.size(); i++) {
            arr[i] = (double)arrList.get(i);
        }
        return arr;
    }
    void printArray(String[] arr){
        System.out.print(arr.length+": ");
        for (String s : arr) {
            System.out.print(s+", ");
        }
        System.out.println();
    }

}


// Helper classes for displaying an entire ad as a list item
class AdAdapter extends ArrayAdapter<String> {
    Context context;
    int[] images;
    String[] adBookNames;
    String[] adSellers;
    double[] adPrices;

    public AdAdapter(Context context,  String[] adBookNames, String[] adSellers, double[] adPrices){
        super(context, R.layout.ad_item, R.id.adBookName, adBookNames);
        this.context = context;
        //this.images = images;
        this.adBookNames = adBookNames;
        this.adSellers = adSellers;
        this.adPrices = adPrices;
        Log.e("adapter", "made "+adSellers.length+" sellers");
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View singleItem = convertView;
        AdViewHolder holder = null;
        if (singleItem == null){
            LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            singleItem = layoutInflater.inflate(R.layout.ad_item, parent, false);
            holder = new AdViewHolder(singleItem);
            singleItem.setTag(holder);
        } else {
            holder = (AdViewHolder) singleItem.getTag();
        }
//        if (holder == null)
//            holder = new AdViewHolder(singleItem);
        Log.e("ADAPTER", "holder "+holder );
        holder.adBookName.setText(adBookNames[position]);
        Log.e("ITEM", "book name "+adBookNames[position] );
        //holder.adSeller.setText(adSellers[position]);
        //holder.adPrice.setText( String.valueOf(adPrices[position]) );
        return super.getView(position, convertView, parent);
    }

}

class AdViewHolder {
    ImageView adImage;
    TextView adBookName;
    TextView adSeller;
    TextView adPrice;
    AdViewHolder(View v) {
        adImage = v.findViewById(R.id.adImage);
        adBookName = v.findViewById(R.id.adBookName);
        adSeller = v.findViewById(R.id.adSeller);
        adPrice = v.findViewById(R.id.adPrice);
    }
}



