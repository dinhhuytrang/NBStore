package vn.edu.fpt.holawear.activities.auth;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import vn.edu.fpt.holawear.R;

public class SignUpActivity extends AppCompatActivity {

    private TextInputEditText etUsername, etEmail, etPassword, etConfirmPassword;
    private Button btnSignUp;

    private OkHttpClient client = new OkHttpClient();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        // Initialize views
        etUsername = findViewById(R.id.etUsername); // Update IDs if needed
        etEmail = findViewById(R.id.etEmail); // Update IDs if needed
        etPassword = findViewById(R.id.etPassword); // Update IDs if needed
        etConfirmPassword = findViewById(R.id.etConfirmPassword); // Update IDs if needed
        btnSignUp = findViewById(R.id.btnSignUp);

        // Set OnClickListener for the signup button
        btnSignUp.setOnClickListener(v -> {
            String username = etUsername.getText().toString();
            String email = etEmail.getText().toString();
            String password = etPassword.getText().toString();
            String confirmPassword = etConfirmPassword.getText().toString();

            if (password.equals(confirmPassword)) {
                // Call the function to create the account
                createAccount(username, email, password);

            } else {
                Toast.makeText(SignUpActivity.this, "Passwords do not match", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void createAccount(String username, String email, String password) {
        // Define the API URL
        String url = "http://192.168.1.159:9999/api/auth/signup"; // Replace with your actual API URL

        // Build the JSON request body
        String json = "{"
                + "\"name\":\"" + username + "\","
                + "\"email\":\"" + email + "\","
                + "\"password\":\"" + password + "\""
                + "}";

        // Create the RequestBody
        RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));

        // Build the POST request
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        // Make the asynchronous network call
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // Handle the error here (e.g., network failure)
                runOnUiThread(() -> Toast.makeText(SignUpActivity.this, "Network error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
                Log.e("SignUp", "Error: " + e.getMessage());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String responseData = Objects.requireNonNull(response.body()).string();

                // Handle the success response , success : 200 => 299
                runOnUiThread(() -> {
                    if (response.isSuccessful()) {
                        try {
                            JSONObject jsonResponse = new JSONObject(responseData);
                            String message = jsonResponse.getString("message");

                            Toast.makeText(SignUpActivity.this,"Create account successful!!" , Toast.LENGTH_SHORT).show();
                            // Optionally, navigate to another screen (e.g., login screen)
                            Intent intent = new Intent(SignUpActivity.this, LoginActivity.class);
                            startActivity(intent);
                            finish();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(SignUpActivity.this, "Error exception sign up: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        }

                    } else {
                        // Handle the server-side error
                        runOnUiThread(() -> {
                            try {
                                JSONObject jsonResponse = new JSONObject(responseData);
                                String message = jsonResponse.getString("message");
                                //Error from api :
                                Toast.makeText(SignUpActivity.this, message, Toast.LENGTH_SHORT).show();
                            } catch (JSONException e) {
                                e.printStackTrace();
                                Toast.makeText(SignUpActivity.this, "Error exception sign up: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                });

            }
        });
    }
}
