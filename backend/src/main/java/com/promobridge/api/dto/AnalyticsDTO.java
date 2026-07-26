package com.promobridge.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    // Business analytics
    private long totalCampaigns;
    private long activeCampaigns;
    private long totalApplicationsReceived;
    private long acceptedApplications;
    private double applicationAcceptanceRate;
    private BigDecimal averageRating;

    // Creator analytics
    private long totalApplicationsSent;
    private long totalAcceptedApplications;
    private double successRate;
    private BigDecimal totalEarnings;
    private int profileViews;

    // Chart data
    private Map<String, Long> monthlyApplications;
    private Map<String, Long> campaignsByStatus;
}
