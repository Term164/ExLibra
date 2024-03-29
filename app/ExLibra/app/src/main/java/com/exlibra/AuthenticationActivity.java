package com.exlibra;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class AuthenticationActivity extends AppCompatActivity {

    GoogleSignInOptions gso;
    GoogleSignInClient gsc;

    Button google;
    Button login;
    Button register;

    FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authentication);

        //test
        mAuth = FirebaseAuth.getInstance();
        Log.e("matuh", "mauth is : "+mAuth.getCurrentUser() );
        FirebaseUser user = mAuth.getCurrentUser();


        google = findViewById(R.id.google);
        login = findViewById(R.id.login);
        register = findViewById(R.id.register);

        login.setOnClickListener(view ->{
            startActivity(new Intent(AuthenticationActivity.this, LoginActivity.class));
        });

        register.setOnClickListener(view ->{
            startActivity(new Intent(AuthenticationActivity.this, RegisterActivity.class));
        });


        //Google
        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        gsc = GoogleSignIn.getClient(this,gso);

        google.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SignIn();
            }
        });
        //--Google
    }

    //Google
    private void SignIn() {
        Log.e("SIGIN", "SignIn: IM IN" );
        Intent intent = gsc.getSignInIntent();
        startActivityForResult(intent, 100);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.d("DEBUG", "google onactresult");
        if(requestCode==100){
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                task.getResult(ApiException.class);
                HomeActivity();
            } catch (ApiException e) {

                Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();
            }
        }
    }
    //--Google

    private void HomeActivity() {
        finish();
        //Intent intent = new Intent(getApplicationContext(), HomeActivity.class);
        startActivity(new Intent(AuthenticationActivity.this, HomeActivity.class));
        //startActivity(intent);
    }
}