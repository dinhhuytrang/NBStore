package vn.edu.fpt.holawear.activities.auth;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;

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
import vn.edu.fpt.holawear.activities.main.MainActivity;

public class LoginActivity extends AppCompatActivity {

    TextInputEditText etEmail, etPassword;
    private OkHttpClient client = new OkHttpClient();
    public static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Initialize SharedPreferences to store user session data
        sharedPreferences = getSharedPreferences("LoginPrefs", Context.MODE_PRIVATE);

        // Init views
        TextView tvSignup = findViewById(R.id.tvSignup);
        Button btnLogin = findViewById(R.id.btnLogin);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);

        // Go to signup activity
        tvSignup.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            startActivity(intent);
        });

        // Handle login button click
        btnLogin.setOnClickListener(v -> {
            String email = Objects.requireNonNull(etEmail.getText()).toString().trim();
            String password = Objects.requireNonNull(etPassword.getText()).toString().trim();

            // Simple validation
            if (TextUtils.isEmpty(email)) {
                etEmail.setError("Please enter your email");
                return;
            }
            if (TextUtils.isEmpty(password)) {
                etPassword.setError("Please enter your password");
                return;
            }

            // Call login logic
            login(email, password);


        });
    }

    private void login(String email, String password) {
        // Define API URL
        String url = "http://192.168.1.159:9999/api/auth/signin";  // Your API URL

        // Create JSON request body
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("email", email);
            jsonObject.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Create the request body
        RequestBody body = RequestBody.create(jsonObject.toString(), JSON);

        // Build the request
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        // Make asynchronous network call
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                // Handle request failure (e.g., network issue)
                runOnUiThread(() -> {
                    Log.e("LoginActivity", "Login failed: " + e.getMessage());
                    Toast.makeText(LoginActivity.this, "Login failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                // Ensure response body is not null to avoid NullPointerException
                String responseData = Objects.requireNonNull(response.body()).string();
                Log.d("LoginActivity", "Response: " + responseData);

                runOnUiThread(() -> {
                    if (response.isSuccessful()) {
                        try {
                            // Convert responseData to JSONObject
                            JSONObject jsonResponse = new JSONObject(responseData);

                            // Extract values from response
                            String message = jsonResponse.getString("message");
                            String accessToken = jsonResponse.getString("accessToken");

                            // Extract user data
                            JSONObject user = jsonResponse.getJSONObject("user");
                            String name = user.getString("name");
                            String id = user.getString("id");
                            String email = user.getString("email");
                            String role = user.getString("role");

                            // Save user data and accessToken to SharedPreferences
                            saveLoginData(name, email, role, accessToken);

                            // Toast message with name and role
                            Toast.makeText(LoginActivity.this, "Login successful, hello " + name + " - " + role, Toast.LENGTH_SHORT).show();

                            // Redirect to MainActivity
                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            startActivity(intent);
                            finish();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(LoginActivity.this, "Error parsing response", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        // Login failed status code 400 - 499
                        try {
                            JSONObject jsonResponse = new JSONObject(responseData);
                            String message = jsonResponse.getString("message");
                            Toast.makeText(LoginActivity.this, message, Toast.LENGTH_SHORT).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(LoginActivity.this, "Error parsing response", Toast.LENGTH_SHORT).show();
                        }

                    }
                });
            }
        });
    }

    // Method to save login data in SharedPreferences
    private void saveLoginData(String name, String email, String role, String accessToken) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("name", name);
        editor.putString("email", email);
        editor.putString("role", role);
        editor.putString("accessToken", accessToken);
        editor.putLong("loginTime", System.currentTimeMillis()); // Save current time (login time)
        editor.apply(); // Apply changes to SharedPreferences
        Log.d("LoginActivity", "User data saved to SharedPreferences");
    }
}
