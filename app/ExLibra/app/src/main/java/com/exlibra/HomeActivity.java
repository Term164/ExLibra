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
import android.view.View;
import android.widget.Button;
import android.widget.TextView;


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

public class HomeActivity extends AppCompatActivity implements homeFragment.OnFragmentInteractionListener, booksFragment.OnFragmentInteractionListener, searchFragment.OnFragmentInteractionListener{

    TextView name,mail;
    Button logout;

    GoogleSignInOptions gso;
    GoogleSignInClient gsc;

    FirebaseAuth mAuth;
    FirebaseFirestore db;

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
        gso=new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        gsc= GoogleSignIn.getClient(this,gso);

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

        if (account!=null){
            String Name = account.getDisplayName();
            String Mail = account.getEmail();

            name.setText(Name);
            mail.setText(Mail);
        }

        Log.d("TAAAAAAAAAAAAAAAAAAAG", "LOGOUT "+logout);
        /*
        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SignOut();
            }
        });
        */

        db = FirebaseFirestore.getInstance();
        CollectionReference cr = db.collection("/books");
        cr.get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
            @Override
            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                if (task.isSuccessful())
                    for (QueryDocumentSnapshot doc : task.getResult())
                        Log.d("DATAAAaaaaaa", doc.getData().toString());
                else
                    Log.w("ERRorrrrrrr", task.getException());
            }
        });


        //initialise toolbar
        //Toolbar myToolbar = findViewById(R.id.my_toolbar);
        //setSupportActionBar(myToolbar);


        //set up first fragment
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.content, homeFragment.newInstance("first", "fragment"));
        transaction.commit();

        //initialise bottom navigation
        BottomNavigationView navigation = findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
        navigation.setSelectedItemId(R.id.action_books);





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


    private final BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {
        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            Fragment selectedFragment;
            switch (item.getItemId()) {
                case R.id.action_home:
                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                    selectedFragment = homeFragment.newInstance("home", "fragment");
                    transaction.replace(R.id.content, selectedFragment);
                    transaction.commit();
                    return true;
                case R.id.action_books:
                    FragmentTransaction transaction2 = getSupportFragmentManager().beginTransaction();
                    selectedFragment = booksFragment.newInstance("books", "fragment");
                    transaction2.replace(R.id.content, selectedFragment);
                    transaction2.commit();
                    return true;
                case R.id.action_search:
                    FragmentTransaction transaction3 = getSupportFragmentManager().beginTransaction();
                    selectedFragment = searchFragment.newInstance("search", "fragment");
                    transaction3.replace(R.id.content, selectedFragment);
                    transaction3.commit();
                    return true;
            }
            return false;
        }
    };

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