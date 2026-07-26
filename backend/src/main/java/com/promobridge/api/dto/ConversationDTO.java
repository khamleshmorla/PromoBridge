package com.promobridge.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private UUID id;
    private UUID businessProfileId;
    private String businessName;
    private UUID creatorProfileId;
    private String creatorName;
    private String creatorProfileImageUrl;
    private UUID applicationId;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private int unreadCount;
}
