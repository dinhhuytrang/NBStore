package vn.edu.fpt.holawear.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import vn.edu.fpt.holawear.models.FoodImage;

public interface FoodishApiService {


    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ssZ").create();
    FoodishApiService apiService = new Retrofit.Builder()
            .baseUrl("https://foodish-api.com/")
            .addConverterFactory(GsonConverterFactory.create(gson)).build().create(FoodishApiService.class);

    @GET("api")
    Call<FoodImage> getRandomFoodImage();
}
