package com.promobridge.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfileDTO {

    private UUID id;

    @NotBlank(message = "Company name is required")
    private String businessName;

    private String category;
    private String website;
    private String logoUrl;
    private String description;
    
    private boolean isVerified;
    private String userId; // Reference to the Clerk user
}
