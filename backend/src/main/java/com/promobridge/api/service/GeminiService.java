package com.promobridge.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promobridge.api.config.AIConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final AIConfig aiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    /**
     * Core method to call Gemini API. All specific AI features should use this method.
     */
    public String generateContent(String prompt) {
        String apiKey = aiConfig.getGeminiApiKey();
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key is missing. Returning fallback content.");
            return "{\"error\": \"AI Service is not configured properly. Missing API Key.\"}";
        }

        String url = GEMINI_API_URL + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", prompt);
        contents.put("parts", List.of(parts));
        requestBody.put("contents", List.of(contents));

        try {
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            Map response = restTemplate.postForObject(url, requestEntity, Map.class);
            return extractTextFromResponse(response);
        } catch (Exception e) {
            log.error("Failed to generate content from Gemini", e);
            return "{\"error\": \"AI Service failed to generate content.\"}";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map response) {
        try {
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
        }
        return "{}";
    }
}
