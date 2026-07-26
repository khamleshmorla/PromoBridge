package com.promobridge.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    public String getGeminiApiKey() {
        return geminiApiKey;
    }
}
