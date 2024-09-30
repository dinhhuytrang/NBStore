package vn.edu.fpt.holawear.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import vn.edu.fpt.holawear.R;

public class TestMainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_main);

        Button buttonLogout = findViewById(R.id.buttonLogout);

        buttonLogout.setOnClickListener(v -> logout());
    }

    private void logout() {
        // Xóa dữ liệu đăng nhập trong SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences("login", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();  // Xóa tất cả dữ liệu
        editor.apply();

        // Chuyển người dùng về màn hình đăng nhập
        Intent intent = new Intent(TestMainActivity.this, TestLoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK); // Xóa tất cả activity trước đó
        startActivity(intent);
    }
}
