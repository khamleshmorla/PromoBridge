package com.promobridge.api.controller;

import com.promobridge.api.dto.ConversationDTO;
import com.promobridge.api.dto.MessageDTO;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.MessagingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/messaging")
@RequiredArgsConstructor
public class MessagingController {

    private final MessagingService messagingService;

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<Page<ConversationDTO>>> getConversations(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 20) Pageable pageable,
            HttpServletRequest request) {
        Page<ConversationDTO> conversations = messagingService.getMyConversations(jwt.getSubject(), pageable);
        return ResponseEntity.ok(ApiResponse.success(conversations, "Conversations retrieved", request.getRequestURI()));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<Page<MessageDTO>>> getMessages(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID conversationId,
            @PageableDefault(size = 50) Pageable pageable,
            HttpServletRequest request) {
        Page<MessageDTO> messages = messagingService.getMessages(conversationId, jwt.getSubject(), pageable);
        return ResponseEntity.ok(ApiResponse.success(messages, "Messages retrieved", request.getRequestURI()));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID conversationId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        MessageDTO msg = messagingService.sendMessage(
                conversationId,
                jwt.getSubject(),
                body.get("content"),
                body.get("messageType"),
                body.get("fileUrl")
        );
        return ResponseEntity.ok(ApiResponse.success(msg, "Message sent", request.getRequestURI()));
    }
}
