package com.resumeradar.security;

import com.resumeradar.service.AdminService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AdminService adminService;

    public SecurityConfig(AdminService adminService) {
        this.adminService = adminService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/analyze", "/api/v1/auth/admin-login", "/healthz").permitAll()
                        .requestMatchers("/api/v1/auth/admin/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthenticationFilter(adminService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    public static class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final AdminService adminService;

        public JwtAuthenticationFilter(AdminService adminService) {
            this.adminService = adminService;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {

            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (adminService.validateToken(token)) {
                    String email = adminService.getEmailFromToken(token);
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }

            filterChain.doFilter(request, response);
        }
    }
}
