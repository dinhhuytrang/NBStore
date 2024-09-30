package vn.edu.fpt.holawear.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import java.io.IOException;

import vn.edu.fpt.holawear.R;

public class TestLoginActivity extends AppCompatActivity {

    private EditText editTextUserName, editTextPassword;
    private TextView textViewResult;
    private CheckBox checkBoxRememberMe;
    private OkHttpClient client = new OkHttpClient();
    public static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private static final long LOGIN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_login);

        editTextUserName = findViewById(R.id.editTextUserName);
        editTextPassword = findViewById(R.id.editTextPassword);
        checkBoxRememberMe = findViewById(R.id.chkRemember);
        Button buttonLogin = findViewById(R.id.buttonLogin);
        textViewResult = findViewById(R.id.textViewResult);

        // Hide the TextView initially
        textViewResult.setVisibility(TextView.GONE);

        // Kiểm tra xem người dùng đã chọn "Remember Me" chưa và còn trong thời hạn đăng nhập không
        checkRememberedLogin();

        buttonLogin.setOnClickListener(v -> login());
    }

    private void checkRememberedLogin() {
        SharedPreferences sharedPreferences = getSharedPreferences("login", MODE_PRIVATE);
        boolean rememberMe = sharedPreferences.getBoolean("rememberMe", false);
        long loginTime = sharedPreferences.getLong("loginTime", 0);
        long currentTime = System.currentTimeMillis();

        if (rememberMe && (currentTime - loginTime) < LOGIN_EXPIRATION_TIME) {
            // Tự động đăng nhập nếu còn trong thời gian cho phép
            Toast.makeText(this, "Logged in automatically", Toast.LENGTH_SHORT).show();
            navigateToMainActivity();
        }
    }

    private void login() {
        String url = "http://192.168.1.159:9999/api/login";  // Your API URL

        // Get the input values
        String userName = editTextUserName.getText().toString();
        String password = editTextPassword.getText().toString();

        // Create the JSON request body
        String json = "{\"userName\":\"" + userName + "\",\"password\":\"" + password + "\"}";
        RequestBody body = RequestBody.create(json, JSON);

        // Create the POST request
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        // Make the API call
        client.newCall(request).enqueue(new Callback() {
            //========================== | Login failed | ==========================
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                runOnUiThread(() -> {
                    // Show TextView and set failure message
                    textViewResult.setText("Login failed: " + e.getMessage());
                    textViewResult.setVisibility(TextView.VISIBLE);  // Show the TextView on failure
                });
            }

            //========================== | Login successful | ==========================
            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                final String responseData = response.body().string();
                runOnUiThread(() -> {
                    // Show TextView only after response
                    textViewResult.setVisibility(TextView.VISIBLE);
                    if (response.isSuccessful()) {
                        textViewResult.setText(responseData); // Show the response message

                        // Remember me
                        if (checkBoxRememberMe.isChecked()) {
                            SharedPreferences sharedPreferences = getSharedPreferences("login", MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putString("userName", userName);
                            editor.putString("password", password);
                            editor.putBoolean("rememberMe", true);
                            editor.putLong("loginTime", System.currentTimeMillis()); // Lưu thời gian đăng nhập
                            editor.apply();
                        }
                        Toast.makeText(TestLoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();

                        // Redirect to the main activity
                        navigateToMainActivity();
                    } else {
                        textViewResult.setText("Login failed");
                    }
                });
            }
        });
    }

    private void navigateToMainActivity() {
        Intent intent = new Intent(TestLoginActivity.this, TestMainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK); // Clear previous activities
        startActivity(intent);
    }
}
