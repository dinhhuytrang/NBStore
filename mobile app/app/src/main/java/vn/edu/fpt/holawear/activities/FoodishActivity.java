package vn.edu.fpt.holawear.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.fpt.holawear.R;
import vn.edu.fpt.holawear.api.FoodishApiService;
import vn.edu.fpt.holawear.models.FoodImage;

public class FoodishActivity extends AppCompatActivity {

    private ImageView foodImageView;
    private Button loadImageButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_foodish);

        foodImageView = findViewById(R.id.foodImageView);
        loadImageButton = findViewById(R.id.loadImageButton);

        // Load random image when the button is clicked
        loadImageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fetchRandomFoodImage();
            }
        });
    }

    // Fetch a random food image from the API
    private void fetchRandomFoodImage() {
        FoodishApiService.apiService.getRandomFoodImage().enqueue(new Callback<FoodImage>() {
            @Override
            // Handle the response from the API
            public void onResponse(Call<FoodImage> call, Response<FoodImage> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String imageUrl = response.body().getImageUrl();
                    Glide.with(FoodishActivity.this)
                            .load(imageUrl)
                            .into(foodImageView);
                }
            }

            @Override
            // Handle the error when failed to fetch the image
            public void onFailure(Call<FoodImage> call, Throwable t) {
                Toast.makeText(FoodishActivity.this, "Failed to load image", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
