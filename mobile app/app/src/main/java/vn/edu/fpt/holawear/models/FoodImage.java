package vn.edu.fpt.holawear.models;

import com.google.gson.annotations.SerializedName;

public class FoodImage {
    @SerializedName("image")
    private String imageUrl;

    public String getImageUrl() {
        return imageUrl;
    }
}
