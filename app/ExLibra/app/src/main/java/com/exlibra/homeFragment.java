package com.exlibra;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class homeFragment extends Fragment {

    //initialise boilerplate attributes and methods
    private static String Name = "param1";
    private static String Mail = "param2";

    TextView name, mail;

    private OnFragmentInteractionListener mListener;


    public homeFragment() {
    }

    public static homeFragment newInstance(String param1, String param2) {
        homeFragment fragment = new homeFragment();
        Bundle args = new Bundle();
        args.putString(Name, param1);
        args.putString(Mail, param2);
        Name = param1;
        Mail = param2;
        Log.e("TAAAAAG", "name is "+Name+" mail "+Mail);
        fragment.setArguments(args);
        Log.e("home", "fragment newInstance");
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            //String NameArg = getArguments().getString(Name);
            //String MailArg = getArguments().getString(Mail);

        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        Log.e("home", "fragment onCreateView");
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        //initialise ui components
        LinearLayout networkAvailability = view.findViewById(R.id.networkAvailability);
        //check internet availability
        if (checkInternet()) {
            networkAvailability.setVisibility(View.GONE);
        } else {
            networkAvailability.setVisibility(View.VISIBLE);
        }
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.e("DEBUG", "views "+name+" "+mail);
        name = getView().findViewById(R.id.name);
        mail = getView().findViewById(R.id.mail);
        name.setText(Name);
        mail.setText(Mail);
    }

    public void onViewCreated(){}

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

    //method to check for internet connection
    private Boolean checkInternet() {
        ConnectivityManager connMgr = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        return (networkInfo != null && networkInfo.isConnected());
    }

    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
