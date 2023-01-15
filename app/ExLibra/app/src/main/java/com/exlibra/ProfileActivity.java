package com.exlibra;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.app.AlertDialog;
import android.widget.Button;
import android.content.DialogInterface;
import android.app.Dialog;

import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.io.IOException;
import java.util.HashMap;


public class ProfileActivity extends AppCompatActivity {

    FirebaseFirestore db;
    FirebaseUser usr;

    EditText firstName;
    EditText lastName;
    EditText username;
    EditText phone;

    Button save;
    Button cancel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        db = FirebaseFirestore.getInstance();
        usr = FirebaseAuth.getInstance().getCurrentUser();

        firstName = findViewById(R.id.editText_firstname);
        lastName = findViewById(R.id.editText_surname);
        username = findViewById(R.id.editText_username);
        phone = findViewById(R.id.editText_Phone);

        save = findViewById(R.id.button_Save);
        cancel = findViewById(R.id.button_Cancel);

        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String firstNameString = firstName.getText().toString();
                String lastNameString = lastName.getText().toString();
                String usernameString = username.getText().toString();
                String phoneString = phone.getText().toString();

                if (TextUtils.isEmpty(usernameString)){
                    Toast.makeText(getApplicationContext(), "Username cannot be empty.", Toast.LENGTH_SHORT).show();
                    return;
                }

                db.collection("/users").document(usr.getUid()).get().addOnCompleteListener(task -> {
                    HashMap<String, Object> me = (HashMap<String, Object>) task.getResult().getData();
                    me.put("name", firstNameString);
                    me.put("surname", lastNameString);
                    me.put("username", usernameString);
                    me.put("tel", phoneString);

                    db.collection("/users").document(usr.getUid()).set(me).addOnSuccessListener(task1 -> {
                        Toast.makeText(getApplicationContext(), "Successfully updated user profile.", Toast.LENGTH_SHORT).show();
                    });
                });
            }
        });

        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(getApplicationContext(), HomeActivity.class));
            }
        });

        getUserFields();
    }

    void getUserFields(){
        db.collection("/users").document(usr.getUid()).get().addOnCompleteListener(task -> {
            HashMap<String,Object> me = (HashMap<String, Object>) task.getResult().getData();
            firstName.setText(me.get("name").toString());
            lastName.setText(me.get("surname").toString());
            username.setText(me.get("username").toString());
            phone.setText(me.get("tel").toString());
        });
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.overflow, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.settings:
                Toast.makeText(getApplicationContext(), "To be implemented in the future.", Toast.LENGTH_SHORT).show();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

}





