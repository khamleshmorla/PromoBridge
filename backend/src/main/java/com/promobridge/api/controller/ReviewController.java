package com.promobridge.api.controller;

import com.promobridge.api.dto.ReviewDTO;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ReviewDTO dto,
            HttpServletRequest request) {
        ReviewDTO review = reviewService.createReview(jwt.getSubject(), dto);
        return ResponseEntity.ok(ApiResponse.success(review, "Review created", request.getRequestURI()));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getUserReviews(
            @PathVariable String userId,
            @PageableDefault(size = 10) Pageable pageable,
            HttpServletRequest request) {
        Page<ReviewDTO> reviews = reviewService.getReviewsForUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Reviews retrieved", request.getRequestURI()));
    }
}
