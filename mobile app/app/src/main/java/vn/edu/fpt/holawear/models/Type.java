package vn.edu.fpt.holawear.models;

public class Type {
    private String id;
    private String name;
    private String description;
    private boolean status;
    private String image;

    // Constructor
    public Type(String id, String name, String description, boolean status, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.image = image;
    }

    // Default constructor
    public Type() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public String toString() {
        return "Type{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", image='" + image + '\'' +
                '}';
    }
}
