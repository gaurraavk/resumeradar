package com.resumeradar.dto;

public class AdminLoginResponse {

    private String token;
    private AdminUserDto user;

    public AdminLoginResponse() {}

    public AdminLoginResponse(String token, AdminUserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public AdminUserDto getUser() {
        return user;
    }

    public void setUser(AdminUserDto user) {
        this.user = user;
    }

    public static class AdminUserDto {
        private String email;
        private String name;
        private String role;

        public AdminUserDto() {}

        public AdminUserDto(String email, String name, String role) {
            this.email = email;
            this.name = name;
            this.role = role;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
