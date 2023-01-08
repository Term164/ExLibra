package com.exlibra;

import android.app.Activity;
import android.content.Context;
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
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

public class homeFragment extends Fragment implements AdapterView.OnItemClickListener{

    //initialise boilerplate attributes and methods
    private static String Name = "param1";
    private static String Mail = "param2";
    String TAG = "DEBUG";

    ListView list;
    Context fragContext;

    ArrayList<String> groupIds = new ArrayList<>();
    ArrayList<String> userIds = new ArrayList<>();
    ArrayList<String> adBookNames = new ArrayList<>();
    ArrayList<String> adSeller = new ArrayList<>();
    ArrayList<Double> adPrices = new ArrayList<>();
    ArrayList<Integer> adImages = new ArrayList<Integer>();


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

    public void getAds(){
        final FirebaseFirestore db = FirebaseFirestore.getInstance();
        final FirebaseUser usr = FirebaseAuth.getInstance().getCurrentUser(); // probably not needed

        CollectionReference cr = db.collection("/oglas");
        cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (!task.isSuccessful())
                    return;
                for (DocumentSnapshot doc : task.getResult().getDocuments()) {
                    adImages.add(R.drawable.ic_local_library); // url slike, zajebana stvar
                    adBookNames.add(""); // get book name
                    adSeller.add(""); // get seller name
                    adPrices.add(doc.getDouble("cena"));

                }

                int[] adImagesArray = makeIntArray(adImages);
                String[] adBookNamesArray = makeStringArray(adBookNames);
                String[] adSellersArray = makeStringArray(adSeller);
                double[] adPricesArray = makeDoubleArray(adPrices);

                AdAdapter adAdapter = new AdAdapter(fragContext, adImagesArray, adBookNamesArray, adSellersArray, adPricesArray);

                list.setAdapter(adAdapter);

            }
        });


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
        Log.e(TAG, "onCreate: "+getView());
        list = getView().findViewById(R.id.adList);

        getAds();
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


    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {

    }

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

}

// Helper classes for displaying an entire ad as a list item
class AdAdapter extends ArrayAdapter<String> {
    Context context;
    int[] images;
    String[] adBookNames;
    String[] adSellers;
    double[] adPrices;

    public AdAdapter(Context context, int[]images, String[] adBookNames, String[] adSellers, double[] adPrices){
        super(context, R.layout.ad_item, R.id.adBookName, adBookNames);
        this.context = context;
        this.images = images;
        this.adBookNames = adBookNames;
        this.adSellers = adSellers;
        this.adPrices = adPrices;
        Log.e("adapter", "made "+adSellers.length+" sellers");
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View singleItem = convertView;
        AdViewHolder holder = null;
        Log.e("adapter", "singleItem "+singleItem);
        if (singleItem == null){
            LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            singleItem = layoutInflater.inflate(R.layout.ad_item, parent, false);
            holder = new AdViewHolder(singleItem);
            singleItem.setTag(holder);
            Log.e("adapter", "holder is "+holder+" and tag is "+singleItem.getTag() );
        } else {
            Log.e("adapter", "attempting to assign to holder "+singleItem.getTag() );
            holder = (AdViewHolder) singleItem.getTag();
        }
        Log.e("adapter", "holder "+holder);
        holder.adImage.setImageResource(images[position]);
        holder.adBookName.setText(adBookNames[position]);
        holder.adSeller.setText(adSellers[position]);
        holder.adPrice.setText( String.valueOf(adPrices[position]) );
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



