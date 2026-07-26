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
public class NotificationDTO {
    private UUID id;
    private String userId;
    private String title;
    private String message;
    private String type;
    private UUID referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
