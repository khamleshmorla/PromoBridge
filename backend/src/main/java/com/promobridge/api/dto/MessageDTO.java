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
public class MessageDTO {
    private UUID id;
    private UUID conversationId;
    private String senderId;
    private String content;
    private String messageType;
    private String fileUrl;
    private LocalDateTime sentAt;
}
