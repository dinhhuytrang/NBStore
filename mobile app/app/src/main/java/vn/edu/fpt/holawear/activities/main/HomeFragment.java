package vn.edu.fpt.holawear.activities.main;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.firebase.database.DatabaseReference;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.util.ArrayList;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import vn.edu.fpt.holawear.R;
import vn.edu.fpt.holawear.activities.SearchActivity;
import vn.edu.fpt.holawear.adapters.BrandAdapter;
import vn.edu.fpt.holawear.adapters.TypeAdapter;
import vn.edu.fpt.holawear.models.Brand;
import vn.edu.fpt.holawear.models.Type;

public class HomeFragment extends Fragment {

    private TextView textViewHey;
    private LinearLayout searchLayout;
    private RecyclerView rvListTypes, rvTopBrands;

    private TypeAdapter typeAdapter;
    private BrandAdapter brandAdapter;
    private ArrayList<Brand> brandList = new ArrayList<>();
    private ArrayList<Type> typeList = new ArrayList<>(); // Initialize list

    public OkHttpClient client = new OkHttpClient();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        textViewHey = view.findViewById(R.id.textViewHey);
        searchLayout = view.findViewById(R.id.searchLayout);
        rvListTypes = view.findViewById(R.id.rvListTypes);
        rvTopBrands = view.findViewById(R.id.rvTopBrands);

        // ===================== Set up the welcome message =====================
        // Get the username from SharedPreferences
        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("LoginPrefs", Context.MODE_PRIVATE);
        String userName = sharedPreferences.getString("name", "User");
        // Set text to the TextView
        textViewHey.setText("Welcome, " + userName);

        // Set up RecyclerView
        typeAdapter = new TypeAdapter(typeList, getContext());
        brandAdapter = new BrandAdapter(brandList, getContext());

        rvListTypes.setLayoutManager(new LinearLayoutManager(getContext()));
        rvListTypes.setAdapter(typeAdapter);
        rvTopBrands.setAdapter(brandAdapter);


        // ===================== Fetch API =====================
        // Set up RecyclerView with vertical orientation
        getAllTypes();
        getAllBrands();

        rvListTypes.setLayoutManager(new LinearLayoutManager(getContext(), RecyclerView.HORIZONTAL, false));
        rvTopBrands.setLayoutManager(new LinearLayoutManager(getContext(), RecyclerView.HORIZONTAL, false));

        rvListTypes.setAdapter(typeAdapter);
        rvTopBrands.setAdapter(brandAdapter);

        // ===================== Call Firebase to get list banner =====================
//        DatabaseReference myref = database.getReference("Banners");


        // ===================== Set up the search layout =====================
        searchLayout.setOnClickListener(v -> {
            // Navigate to the SearchActivity
            Intent intent = new Intent(getActivity(), SearchActivity.class);
            startActivity(intent);
        });

        return view;
    }

    // Fetch API for all types
    public void getAllTypes() {
        String url = "http://192.168.1.159:9999/api/type/get-all";
        Request request = new Request.Builder().url(url).build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // Handle the failure
                Log.e("API Error", "Failed to fetch types", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String responseData = response.body().string();

                    // Parse the JSON using Gson
                    Gson gson = new Gson();
                    java.lang.reflect.Type type = new TypeToken<ArrayList<Type>>(){}.getType();
                    ArrayList<Type> typesFromApi = gson.fromJson(responseData, type);
//                    Log.d("API Response", "Types: " + typesFromApi);

                    // Update the list and notify the adapter on the main thread
                    getActivity().runOnUiThread(() -> {
                        typeList.clear();
                        typeList.addAll(typesFromApi);
                        typeAdapter.notifyDataSetChanged();  // Notify the adapter of data change
                    });
                }
            }
        });
    }

    // Fetch API for all brands
    public void getAllBrands(){
        String url = "http://192.168.1.159:9999/api/brand/get-all";
        Request request = new Request.Builder().url(url).build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e("API Error", "Failed to fetch brands", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String responseData = response.body().string();
                    Gson gson = new Gson();
                    java.lang.reflect.Type type = new TypeToken<ArrayList<Brand>>(){}.getType();
                    ArrayList<Brand> brandsFromApi = gson.fromJson(responseData, type);

                    // Update brand list in UI (if applicable)
                    getActivity().runOnUiThread(() -> {
                        brandList.clear();
                        brandList.addAll(brandsFromApi);
                        brandAdapter.notifyDataSetChanged();
                    });
                }
            }
        });
    }

    //

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        client.dispatcher().cancelAll();
    }
}
