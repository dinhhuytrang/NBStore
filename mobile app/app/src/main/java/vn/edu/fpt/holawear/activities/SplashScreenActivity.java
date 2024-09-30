package vn.edu.fpt.holawear.activities;

import android.app.ActionBar;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import vn.edu.fpt.holawear.activities.auth.LoginActivity;
import vn.edu.fpt.holawear.activities.main.MainActivity;
import vn.edu.fpt.holawear.R;

public class SplashScreenActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash_screen);

        new CountDownTimer(3000,1000) {
            //Hàm này sẽ được gọi sau mỗi lần đếm ngược
            public void onTick(long millisUntilFinished) {
            }
            //Hàm này sẽ được gọi sau khi đếm ngược kết thúc
            public void onFinish() {
                //Chuyển màn hình từ WelcomeActivity sang LoginActivity
                Intent intent = new Intent(SplashScreenActivity.this, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        }.start();
    }
}