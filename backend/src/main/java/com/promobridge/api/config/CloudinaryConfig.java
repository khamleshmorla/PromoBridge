package com.promobridge.api.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${CLOUDINARY_URL:}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
            return new Cloudinary(cloudinaryUrl);
        }
        
        // Fallback for missing config so application starts
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dummy_cloud_name");
        config.put("api_key", "dummy_api_key");
        config.put("api_secret", "dummy_api_secret");
        return new Cloudinary(config);
    }
}
