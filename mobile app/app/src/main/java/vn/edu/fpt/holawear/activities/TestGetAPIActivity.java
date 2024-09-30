package vn.edu.fpt.holawear.activities;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import java.io.IOException;
import vn.edu.fpt.holawear.R;

public class TestGetAPIActivity extends AppCompatActivity {

    private TextView textViewResponse;
    private OkHttpClient client = new OkHttpClient();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_get_apiactivity);

        Button buttonTestAPI = findViewById(R.id.button_test_api);
        textViewResponse = findViewById(R.id.textview_response);

        buttonTestAPI.setOnClickListener(view -> {
            testAPI();
        });
    }

    private void testAPI() {
        String PROTOCOL = "http";
        String IP_ADDRESS = "192.168.1.159";
        int PORT = 9999;
        String ENDPOINT = "/api/test";

        //url get from the above information => result: http://192.168.1.159:9999/api/test
        String url = PROTOCOL + "://" + IP_ADDRESS + ":" + PORT + ENDPOINT;

        Request request = new Request.Builder()
                .url(url)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                runOnUiThread(() -> textViewResponse.setText("API call failed: " + e.getMessage()));
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    final String myResponse = response.body().string();
                    runOnUiThread(() -> textViewResponse.setText(myResponse));
                } else {
                    runOnUiThread(() -> textViewResponse.setText("API call failed: " + response.message()));
                }
            }
        });
    }
}
