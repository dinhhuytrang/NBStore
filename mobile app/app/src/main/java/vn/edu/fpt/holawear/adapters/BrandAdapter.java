package vn.edu.fpt.holawear.adapters;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;

import java.util.ArrayList;
import vn.edu.fpt.holawear.R;
import vn.edu.fpt.holawear.models.Brand;

public class BrandAdapter extends RecyclerView.Adapter<BrandAdapter.ViewHolder> {

    private ArrayList<Brand> brandList;
    private Context myContext;

    public BrandAdapter(ArrayList<Brand> brandList, Context myContext) {
        this.brandList = brandList;
        this.myContext = myContext;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView textViewName;
        ImageView imageView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            textViewName = itemView.findViewById(R.id.tv_brand_name);
            imageView = itemView.findViewById(R.id.iv_brand_image);
        }
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
//        LayoutInflater inflater = ((Activity) myContext).getLayoutInflater();
//        View view = inflater.inflate(R.layout.viewholder_brand_item, parent, false);
//        return new ViewHolder(view);
        LayoutInflater inflater = LayoutInflater.from(myContext);
        View view = inflater.inflate(R.layout.viewholder_brand_item, parent, false);
        return new ViewHolder(view);

    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Brand brand = brandList.get(position);
        holder.textViewName.setText(brand.getName());
        // Load the brand image using Glide, with placeholders and error handling
        Glide.with(myContext)
                .load(brand.getImage()).into(holder.imageView);  // Target the ImageView
    }

    @Override
    public int getItemCount() {
        return brandList.size();
    }



}
