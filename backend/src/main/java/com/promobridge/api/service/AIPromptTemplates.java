package com.promobridge.api.service;

public class AIPromptTemplates {

    public static final String JSON_FORMAT_INSTRUCTION = "Please respond ONLY with valid JSON. Do not include markdown formatting or backticks around the JSON block.";

    public static String generateCampaignPrompt(String input) {
        return "You are an expert marketing strategist for an influencer marketplace.\n" +
               "Based on the following business request, generate a comprehensive campaign proposal.\n" +
               "Request: " + input + "\n\n" +
               "Your response must be in the following JSON format:\n" +
               "{\n" +
               "  \"title\": \"Catchy Campaign Title\",\n" +
               "  \"description\": \"Detailed description of the campaign goals and vibe\",\n" +
               "  \"requirements\": \"Specific creator requirements (e.g., follower count, niche, aesthetic)\",\n" +
               "  \"suggestedBudget\": 15000,\n" +
               "  \"deliverables\": \"List of expected content pieces (e.g., 2 Reels, 3 Stories)\",\n" +
               "  \"timeline\": \"Suggested duration and deadlines\"\n" +
               "}\n\n" +
               JSON_FORMAT_INSTRUCTION;
    }

    public static String generateMatchScorePrompt(String campaignDetails, String creatorDetails) {
        return "You are an AI matching engine for an influencer marketplace.\n" +
               "Analyze the compatibility between the following campaign and creator.\n" +
               "Campaign: " + campaignDetails + "\n" +
               "Creator: " + creatorDetails + "\n\n" +
               "Calculate a match score from 0 to 100 based on niche alignment, audience size, budget expectations, and content style.\n" +
               "Your response must be in the following JSON format:\n" +
               "{\n" +
               "  \"score\": 85,\n" +
               "  \"reasons\": [\"Reason 1\", \"Reason 2\"]\n" +
               "}\n\n" +
               JSON_FORMAT_INSTRUCTION;
    }
    
    public static String generateProposalPrompt(String campaignDetails, String creatorDetails) {
        return "You are an expert talent manager representing an influencer.\n" +
               "Write a professional, persuasive, and concise proposal for this campaign.\n" +
               "Campaign: " + campaignDetails + "\n" +
               "Creator: " + creatorDetails + "\n\n" +
               "Your response must be in the following JSON format:\n" +
               "{\n" +
               "  \"content\": \"The generated proposal text goes here. Keep it professional, enthusiastic, and under 200 words.\"\n" +
               "}\n\n" +
               JSON_FORMAT_INSTRUCTION;
    }

    public static String generateRiskAssessmentPrompt(String creatorDetails) {
        return "You are a fraud detection AI for an influencer platform.\n" +
               "Analyze this creator profile for signs of fake engagement or inflated metrics.\n" +
               "Creator: " + creatorDetails + "\n\n" +
               "Your response must be in the following JSON format:\n" +
               "{\n" +
               "  \"riskScore\": 15,\n" +
               "  \"riskLevel\": \"LOW\", // LOW, MEDIUM, HIGH\n" +
               "  \"analysis\": \"Explanation of why this score was given, mentioning specific metrics.\"\n" +
               "}\n\n" +
               JSON_FORMAT_INSTRUCTION;
    }

    public static String generateProfileImprovementPrompt(String profileDetails) {
        return "You are a top-tier personal branding coach for content creators.\n" +
               "Analyze this profile and suggest improvements to attract more brand deals.\n" +
               "Profile: " + profileDetails + "\n\n" +
               "Your response must be in the following JSON format:\n" +
               "{\n" +
               "  \"suggestedBio\": \"An improved, catchy bio\",\n" +
               "  \"missingFields\": [\"Field 1\", \"Field 2\"],\n" +
               "  \"actionableTips\": [\"Tip 1\", \"Tip 2\"]\n" +
               "}\n\n" +
               JSON_FORMAT_INSTRUCTION;
    }
}
