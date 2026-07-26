package com.promobridge.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.AIPromptTemplates;
import com.promobridge.api.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    @PostMapping("/generate-campaign")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateCampaign(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String input = requestBody.get("input");
        if (input == null || input.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Input is required", List.of("Input cannot be empty"), request.getRequestURI()));
        }

        String prompt = AIPromptTemplates.generateCampaignPrompt(input);
        String aiResponse = geminiService.generateContent(prompt);

        return ResponseEntity.ok(ApiResponse.success(parseJson(aiResponse), "Campaign generated successfully", request.getRequestURI()));
    }

    @PostMapping("/match-score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateMatchScore(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String campaignDetails = requestBody.get("campaignDetails");
        String creatorDetails = requestBody.get("creatorDetails");
        
        String prompt = AIPromptTemplates.generateMatchScorePrompt(campaignDetails, creatorDetails);
        String aiResponse = geminiService.generateContent(prompt);

        return ResponseEntity.ok(ApiResponse.success(parseJson(aiResponse), "Match score calculated successfully", request.getRequestURI()));
    }

    @PostMapping("/generate-proposal")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateProposal(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String campaignDetails = requestBody.get("campaignDetails");
        String creatorDetails = requestBody.get("creatorDetails");
        
        String prompt = AIPromptTemplates.generateProposalPrompt(campaignDetails, creatorDetails);
        String aiResponse = geminiService.generateContent(prompt);

        return ResponseEntity.ok(ApiResponse.success(parseJson(aiResponse), "Proposal generated successfully", request.getRequestURI()));
    }

    private Map<String, Object> parseJson(String jsonString) {
        try {
            // Clean up possible markdown artifacts from Gemini response
            String cleanJson = jsonString.replaceAll("```json", "").replaceAll("```", "").trim();
            @SuppressWarnings("unchecked")
            Map<String, Object> result = objectMapper.readValue(cleanJson, Map.class);
            return result;
        } catch (JsonProcessingException e) {
            // Fallback if parsing fails
            return Map.of("error", "Failed to parse AI response", "raw", jsonString);
        }
    }
}
