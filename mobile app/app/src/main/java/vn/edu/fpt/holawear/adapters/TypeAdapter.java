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

import java.util.ArrayList;
import vn.edu.fpt.holawear.R;
import vn.edu.fpt.holawear.models.Type;

public class TypeAdapter extends RecyclerView.Adapter<TypeAdapter.ViewHolder> {

    private ArrayList<Type> typeList;
    private Context myContext;

    public TypeAdapter(ArrayList<Type> typeList, Context myContext) {
        this.typeList = typeList;
        this.myContext = myContext;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView textViewName;
        ImageView imageView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            textViewName = itemView.findViewById(R.id.textViewName);
            imageView = itemView.findViewById(R.id.pic);
        }
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = ((Activity) myContext).getLayoutInflater();
        View view = inflater.inflate(R.layout.viewholder_type_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        // Get data from the position
        Type type = typeList.get(position);

        // Set data to the TextView
        holder.textViewName.setText(type.getName());

        // Use Glide to load the image from URL into the ImageView
        Glide.with(myContext)
                .load(type.getImage())  // Pass the image URL
//                .placeholder(R.drawable.placeholder_image) // Optional: placeholder image while loading
//                .error(R.drawable.error_image) // Optional: image in case of error
                .into(holder.imageView);  // Target the ImageView
    }

    @Override
    public int getItemCount() {
        return typeList.size();
    }
}
