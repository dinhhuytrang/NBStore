package vn.edu.fpt.holawear.models;

import java.util.Arrays;

public class User {
    private String email;
    private String password;
    private String name;
    private String gender;  // e.g., "Male", "Female", "Other"
    private String phone;
    private String status;  // e.g., "Active", "Inactive"
    private String role;    // e.g., "Admin", "Customer"
    private String[] shippingAddress;  // Array to hold multiple addresses

    // Constructor
    public User(String email, String password, String name, String gender, String phone, String status, String role, String[] shippingAddress) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.gender = gender;
        this.phone = phone;
        this.status = status;
        this.role = role;
        this.shippingAddress = shippingAddress;
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Default constructor
    public User() {}

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String[] getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String[] shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", gender='" + gender + '\'' +
                ", phone='" + phone + '\'' +
                ", status='" + status + '\'' +
                ", role='" + role + '\'' +
                ", shippingAddress=" + Arrays.toString(shippingAddress) +
                '}';
    }
}
