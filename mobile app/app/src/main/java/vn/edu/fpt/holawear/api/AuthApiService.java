package vn.edu.fpt.holawear.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import vn.edu.fpt.holawear.models.Auth;
import vn.edu.fpt.holawear.models.User;


public interface AuthApiService {


    String PROTOCOL = "http";
    String IP_ADDRESS = "192.168.1.159";
    int PORT = 9999;
    String ENDPOINT = "/api/test";
///192.168.1.159


    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ssZ").create();
    AuthApiService apiService = new Retrofit.Builder()
            .baseUrl("http://192.168.1.159:9999/api/auth/")
            .addConverterFactory(GsonConverterFactory.create(gson)).build().create(AuthApiService.class);

    @POST("signin")
    Call<Auth> login(
            //{
            //    "email" : "admin@gmail.com",
            //    "password" : "abc123"
            //}
            @Body Auth auth
    );

}
