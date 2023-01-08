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
import android.view.Menu;
import android.view.MenuItem;


import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

public class HomeActivity extends AppCompatActivity implements homeFragment.OnFragmentInteractionListener, booksFragment.OnFragmentInteractionListener, chatFragment.OnFragmentInteractionListener{

    public String name,mail;

    GoogleSignInOptions gso;
    GoogleSignInClient gsc;

    FirebaseAuth mAuth;
    public FirebaseFirestore db;

    //method to manage fragments for bottom nav
    private final BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {
        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            Fragment selectedFragment;
            switch (item.getItemId()) {
                case R.id.action_home:
                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                    selectedFragment = homeFragment.newInstance(name, mail);
                    transaction.replace(R.id.content, selectedFragment);
                    transaction.commit();
                    return true;
                case R.id.action_books:
                    FragmentTransaction transaction2 = getSupportFragmentManager().beginTransaction();
                    selectedFragment = booksFragment.newInstance("books", "fragment", db);
                    transaction2.replace(R.id.content, selectedFragment);
                    transaction2.commit();
                    return true;
                case R.id.action_chat:
                    // create new activity
                    startActivity(new Intent(HomeActivity.this, ChatActivity.class));
                    //FragmentTransaction transaction3 = getSupportFragmentManager().beginTransaction();
                    //selectedFragment = chatFragment.newInstance("search", "fragment");
                    //transaction3.replace(R.id.content, selectedFragment);
                    //transaction3.commit();
                    return true;
            }
            return false;
        }
    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        //test
        mAuth = FirebaseAuth.getInstance();
        FirebaseUser user = mAuth.getCurrentUser();
        if (user != null){
            System.out.println("===================================================================================================================================Zdaj sem logiran");;
        }
        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        gsc = GoogleSignIn.getClient(this,gso);

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

        //Testiranje logiranja z googlom != => ==
        if (account!=null){
            name = account.getDisplayName();
            mail = account.getEmail();

            //name.setText(Name);
            //mail.setText(Mail);
        }

        /*
        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SignOut();
            }
        });
        */

        db = FirebaseFirestore.getInstance();


        //initialise toolbar
        Toolbar myToolbar = findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);

        //set up first fragment
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.content, homeFragment.newInstance(name, mail));
        transaction.commit();

        //initialise bottom navigation
        BottomNavigationView navigation = findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
        navigation.setSelectedItemId(R.id.action_home);


    }

    private void SignOut() {
        gsc.signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                FirebaseAuth.getInstance().signOut();
                finish();
                startActivity(new Intent(getApplicationContext(), AuthenticationActivity.class));
            }
        });

    }

    private void UserProfile(){
        startActivity(new Intent(getApplicationContext(), ProfileActivity.class));
    }



    //initialise toolbar options
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.action_bar, menu);
        return true;
    }



    //initialise toolbar actions
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_logout:
                SignOut();
                return true;
            case R.id.action_profile:
                UserProfile();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }



    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {
        super.onPointerCaptureChanged(hasCapture);
    }
}