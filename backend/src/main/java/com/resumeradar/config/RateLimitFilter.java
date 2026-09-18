package com.resumeradar.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeradar.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${resumeradar.ratelimit.enabled:true}")
    private boolean enabled;

    @Value("${resumeradar.ratelimit.requests-per-minute:30}")
    private int maxRequestsPerMinute;

    private final Map<String, RequestTracker> clientRequests = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!enabled || !request.getRequestURI().startsWith("/api/v1/analyze")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        long now = System.currentTimeMillis();

        RequestTracker tracker = clientRequests.compute(clientIp, (key, current) -> {
            if (current == null || now - current.windowStart > 60000) {
                return new RequestTracker(now, 1);
            }
            current.count++;
            return current;
        });

        if (tracker.count > maxRequestsPerMinute) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ApiResponse<Void> err = ApiResponse.error("Rate limit exceeded. Maximum " + maxRequestsPerMinute + " requests per minute.");
            response.getWriter().write(objectMapper.writeValueAsString(err));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RequestTracker {
        long windowStart;
        int count;

        RequestTracker(long windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
