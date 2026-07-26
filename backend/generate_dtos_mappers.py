import os

dtos = {
    "BusinessProfileDto": """package com.promobridge.api.dto;

import lombok.Data;
import java.util.UUID;
import java.math.BigDecimal;

@Data
public class BusinessProfileDto {
    private UUID id;
    private String businessName;
    private String ownerName;
    private String category;
    private String description;
    private String website;
    private String location;
    private String city;
    private Boolean isVerified;
    private BigDecimal averageRating;
    private String logoUrl;
}""",
    
    "CreatorProfileDto": """package com.promobridge.api.dto;

import lombok.Data;
import java.util.UUID;
import java.math.BigDecimal;

@Data
public class CreatorProfileDto {
    private UUID id;
    private String name;
    private String bio;
    private Integer followers;
    private BigDecimal engagementRate;
    private String location;
    private String city;
    private Boolean isVerified;
    private BigDecimal averageRating;
    private String profileImageUrl;
}""",
    
    "CampaignDto": """package com.promobridge.api.dto;

import lombok.Data;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CampaignDto {
    private UUID id;
    private UUID businessId;
    private String title;
    private String description;
    private BigDecimal budget;
    private String campaignType;
    private String location;
    private Boolean isRemote;
    private LocalDateTime deadline;
    private String status;
}"""
}

mappers = {
    "BusinessProfileMapper": """package com.promobridge.api.mapper;

import com.promobridge.api.dto.BusinessProfileDto;
import com.promobridge.api.entity.BusinessProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BusinessProfileMapper {
    BusinessProfileDto toDto(BusinessProfile entity);
    BusinessProfile toEntity(BusinessProfileDto dto);
}""",
    
    "CreatorProfileMapper": """package com.promobridge.api.mapper;

import com.promobridge.api.dto.CreatorProfileDto;
import com.promobridge.api.entity.CreatorProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CreatorProfileMapper {
    CreatorProfileDto toDto(CreatorProfile entity);
    CreatorProfile toEntity(CreatorProfileDto dto);
}""",

    "CampaignMapper": """package com.promobridge.api.mapper;

import com.promobridge.api.dto.CampaignDto;
import com.promobridge.api.entity.Campaign;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CampaignMapper {
    @Mapping(source = "businessProfile.id", target = "businessId")
    CampaignDto toDto(Campaign entity);
    
    @Mapping(source = "businessId", target = "businessProfile.id")
    Campaign toEntity(CampaignDto dto);
}"""
}

def generate():
    os.makedirs("src/main/java/com/promobridge/api/dto", exist_ok=True)
    os.makedirs("src/main/java/com/promobridge/api/mapper", exist_ok=True)
    
    for name, content in dtos.items():
        with open(f"src/main/java/com/promobridge/api/dto/{name}.java", "w") as f:
            f.write(content)
            
    for name, content in mappers.items():
        with open(f"src/main/java/com/promobridge/api/mapper/{name}.java", "w") as f:
            f.write(content)

if __name__ == "__main__":
    generate()
    print("DTOs and Mappers generated successfully.")
