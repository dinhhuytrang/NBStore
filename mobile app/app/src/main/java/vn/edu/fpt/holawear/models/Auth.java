package vn.edu.fpt.holawear.models;

public class Auth {
    String email;
    String password;

    public Auth(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Auth() {
    }

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

    @Override
    public String toString() {
        return "Auth{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
