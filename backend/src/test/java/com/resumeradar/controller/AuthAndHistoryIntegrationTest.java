package com.resumeradar.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeradar.dto.AnalysisRequest;
import com.resumeradar.dto.LoginRequest;
import com.resumeradar.dto.RegisterRequest;
import com.resumeradar.model.AnalysisRecord;
import com.resumeradar.model.ResumeTemplate;
import com.resumeradar.model.User;
import com.resumeradar.repository.AnalysisRecordRepository;
import com.resumeradar.repository.ResumeTemplateRepository;
import com.resumeradar.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndHistoryIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnalysisRecordRepository analysisRecordRepository;

    @Autowired
    private ResumeTemplateRepository resumeTemplateRepository;

    @Test
    void testRegisterSuccessAndBcryptHash() throws Exception {
        String email = "alice_" + System.currentTimeMillis() + "@example.com";
        RegisterRequest req = new RegisterRequest("Alice Smith", email, "password123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value(email))
                .andExpect(jsonPath("$.data.user.fullName").value("Alice Smith"))
                .andExpect(jsonPath("$.data.user.role").value("USER"))
                .andReturn();

        // Verify password hash in DB starts with $2 (BCrypt) and differs from plain password
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        assertTrue(userOpt.isPresent());
        User user = userOpt.get();
        assertNotNull(user.getPasswordHash());
        assertTrue(user.getPasswordHash().startsWith("$2"), "Password hash must start with $2 for BCrypt");
        assertNotEquals("password123", user.getPasswordHash());
    }

    @Test
    void testRegisterDuplicateEmailReturns409() throws Exception {
        String email = "bob_" + System.currentTimeMillis() + "@example.com";
        RegisterRequest req1 = new RegisterRequest("Bob Jones", email, "secret1234");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk());

        // Duplicate registration attempt
        RegisterRequest req2 = new RegisterRequest("Bob Duplicate", email, "secret5678");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testRegisterShortPasswordReturns400() throws Exception {
        RegisterRequest req = new RegisterRequest("Short Pass", "short@example.com", "12345");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testLoginSuccessAndFailure() throws Exception {
        String email = "charlie_" + System.currentTimeMillis() + "@example.com";
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("Charlie Brown", email, "charliePass1"))))
                .andExpect(status().isOk());

        // Wrong password -> 401
        LoginRequest wrongReq = new LoginRequest(email, "wrongpassword");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        // Correct password -> 200
        LoginRequest validReq = new LoginRequest(email, "charliePass1");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value(email));

        // Verify last_login_at updated in DB
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        assertNotNull(user.getLastLoginAt());
    }

    @Test
    void testGetAuthMe() throws Exception {
        String email = "diana_" + System.currentTimeMillis() + "@example.com";
        MvcResult regResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("Diana Prince", email, "wonderwoman8"))))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(regResult.getResponse().getContentAsString()).path("data").path("token").asText();

        // Without token -> unauthorized (401)
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());

        // With valid token -> profile returned, never returns password hash
        MvcResult meResult = mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(email))
                .andExpect(jsonPath("$.data.fullName").value("Diana Prince"))
                .andExpect(jsonPath("$.data.role").value("USER"))
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist())
                .andReturn();

        String json = meResult.getResponse().getContentAsString();
        assertFalse(json.contains("passwordHash"), "Never return password hash in profile response");
    }

    @Test
    void testHistoryIsolationBetweenUsers() throws Exception {
        String emailA = "user_a_" + System.currentTimeMillis() + "@example.com";
        String emailB = "user_b_" + System.currentTimeMillis() + "@example.com";

        MvcResult regA = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("User A", emailA, "userASecret1"))))
                .andExpect(status().isOk()).andReturn();
        String tokenA = objectMapper.readTree(regA.getResponse().getContentAsString()).path("data").path("token").asText();

        MvcResult regB = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("User B", emailB, "userBSecret1"))))
                .andExpect(status().isOk()).andReturn();
        String tokenB = objectMapper.readTree(regB.getResponse().getContentAsString()).path("data").path("token").asText();

        // User A performs analysis
        AnalysisRequest reqA = new AnalysisRequest(
                "Jane Doe\nSoftware Engineer with Java and Spring Boot experience\nSkills: Java, Docker",
                "Looking for a Senior Java Developer with Spring Boot and AWS experience",
                "Java Engineer"
        );
        mockMvc.perform(post("/api/v1/analyze")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqA)))
                .andExpect(status().isOk());

        // User B performs analysis
        AnalysisRequest reqB = new AnalysisRequest(
                "John Smith\nFrontend Developer with React and TypeScript experience\nSkills: React, CSS",
                "Looking for a Frontend Engineer with React and Next.js experience",
                "Frontend Engineer"
        );
        mockMvc.perform(post("/api/v1/analyze")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqB)))
                .andExpect(status().isOk());

        // Fetch User A history -> must only have "Java Engineer"
        MvcResult histAResult = mockMvc.perform(get("/api/v1/history/me")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode dataA = objectMapper.readTree(histAResult.getResponse().getContentAsString()).path("data");
        assertTrue(dataA.isArray());
        for (JsonNode item : dataA) {
            assertNotEquals("Frontend Engineer", item.path("jobTitle").asText());
        }

        // Fetch User B history -> must only have "Frontend Engineer"
        MvcResult histBResult = mockMvc.perform(get("/api/v1/history/me")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode dataB = objectMapper.readTree(histBResult.getResponse().getContentAsString()).path("data");
        assertTrue(dataB.isArray());
        for (JsonNode item : dataB) {
            assertNotEquals("Java Engineer", item.path("jobTitle").asText());
        }
    }

    @Test
    void testGuestAnalysisSucceedsAndHasNullUserId() throws Exception {
        AnalysisRequest guestReq = new AnalysisRequest(
                "Guest User\nGeneral software developer with Python and Linux knowledge",
                "Requires Python and Docker background for DevOps role",
                "DevOps Guest"
        );

        MvcResult result = mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guestReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String analysisId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("analysisId").asText();
        assertNotNull(analysisId);

        Optional<AnalysisRecord> record = analysisRecordRepository.findFirstByAnalysisId(analysisId);
        assertTrue(record.isPresent());
        assertNull(record.get().getUserId(), "Guest analysis must have null userId");
        assertEquals("DevOps Guest", record.get().getJobTitle());
    }

    @Test
    void testTemplatesSeededInDatabase() throws Exception {
        long count = resumeTemplateRepository.count();
        assertTrue(count >= 4, "Database must have at least 4 seeded templates");

        mockMvc.perform(get("/api/v1/templates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(4))))
                .andExpect(jsonPath("$.data[0].id").value("classic"))
                .andExpect(jsonPath("$.data[1].id").value("modern"))
                .andExpect(jsonPath("$.data[2].id").value("fresher-focus"))
                .andExpect(jsonPath("$.data[3].id").value("executive"));
    }

    @Test
    void testGenerateFixedResumeUpdatesTemplateUsed() throws Exception {
        AnalysisRequest req = new AnalysisRequest(
                "Jane Template User\nJava backend developer with 3 years experience\nSKILLS: Java",
                "Looking for a Senior Java Developer with Spring and Docker",
                "Template Role"
        );

        MvcResult analysisResult = mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String analysisId = objectMapper.readTree(analysisResult.getResponse().getContentAsString()).path("data").path("analysisId").asText();

        // Generate fixed resume with modern template
        mockMvc.perform(post("/api/v1/generate-fixed-resume")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "analysisId", analysisId,
                                "templateId", "modern"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.templateId").value("modern"));

        // Verify template_used updated in DB
        Optional<AnalysisRecord> updated = analysisRecordRepository.findFirstByAnalysisId(analysisId);
        assertTrue(updated.isPresent());
        assertEquals("modern", updated.get().getTemplateUsed());
    }

    @Test
    void testAdminEndpointsAccessLevels() throws Exception {
        // 1. No token -> 401
        mockMvc.perform(get("/api/v1/admin/analytics"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isUnauthorized());

        // 2. User token -> 403
        String userEmail = "normal_user_" + System.currentTimeMillis() + "@example.com";
        MvcResult regRes = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("Normal User", userEmail, "password123"))))
                .andExpect(status().isOk())
                .andReturn();
        String userToken = objectMapper.readTree(regRes.getResponse().getContentAsString()).path("data").path("token").asText();

        mockMvc.perform(get("/api/v1/admin/analytics")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());

        // 3. Admin token -> 200
        MvcResult adminLoginRes = mockMvc.perform(post("/api/v1/auth/admin-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("email", "admin@resumeradar.io", "password", "admin123"))))
                .andExpect(status().isOk())
                .andReturn();
        String adminToken = objectMapper.readTree(adminLoginRes.getResponse().getContentAsString()).path("data").path("token").asText();

        mockMvc.perform(get("/api/v1/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testAdminAnalyticsAggregationAndUsersList() throws Exception {
        // Obtain admin token
        MvcResult adminLoginRes = mockMvc.perform(post("/api/v1/auth/admin-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("email", "admin@resumeradar.io", "password", "admin123"))))
                .andExpect(status().isOk())
                .andReturn();
        String adminToken = objectMapper.readTree(adminLoginRes.getResponse().getContentAsString()).path("data").path("token").asText();

        // Query analytics
        mockMvc.perform(get("/api/v1/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.newUsersLast7Days", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalAnalyses", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.analysesLast7Days", hasSize(7)))
                .andExpect(jsonPath("$.data.averageAtsScore").isNumber())
                .andExpect(jsonPath("$.data.scoreBuckets['0-39']").isNumber())
                .andExpect(jsonPath("$.data.scoreBuckets['40-59']").isNumber())
                .andExpect(jsonPath("$.data.scoreBuckets['60-79']").isNumber())
                .andExpect(jsonPath("$.data.scoreBuckets['80-100']").isNumber())
                .andExpect(jsonPath("$.data.templateUsage").isArray())
                .andExpect(jsonPath("$.data.topMissingKeywords").isArray())
                .andExpect(jsonPath("$.data.inputTypeSplit.text").isNumber())
                .andExpect(jsonPath("$.data.inputTypeSplit.file").isNumber())
                .andExpect(jsonPath("$.data.recentAnalyses").isArray());

        // Query users list
        MvcResult usersRes = mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].id").isNumber())
                .andExpect(jsonPath("$.data[0].email").isNotEmpty())
                .andExpect(jsonPath("$.data[0].passwordHash").doesNotExist())
                .andReturn();

        String json = usersRes.getResponse().getContentAsString();
        assertFalse(json.contains("passwordHash"), "Users list must never contain passwordHash");
    }
}
