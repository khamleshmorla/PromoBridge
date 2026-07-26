package com.promobridge.api.service;

import com.promobridge.api.dto.ConversationDTO;
import com.promobridge.api.dto.MessageDTO;
import com.promobridge.api.entity.*;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ConversationDTO> getMyConversations(String userId, Pageable pageable) {
        return conversationRepository.findByParticipantUserId(userId, pageable).map(this::toConversationDTO);
    }

    @Transactional(readOnly = true)
    public Page<MessageDTO> getMessages(UUID conversationId, String userId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));

        if (!isParticipant(conversation, userId)) {
            throw new IllegalStateException("Not authorized to view this conversation");
        }

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, pageable)
                .map(this::toMessageDTO);
    }

    @Transactional
    public MessageDTO sendMessage(UUID conversationId, String senderId, String content, String messageType, String fileUrl) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));

        if (!isParticipant(conversation, senderId)) {
            throw new IllegalStateException("Not authorized to send messages in this conversation");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .messageType(messageType != null ? messageType : "TEXT")
                .fileUrl(fileUrl)
                .build();

        message = messageRepository.save(message);
        return toMessageDTO(message);
    }

    private boolean isParticipant(Conversation conversation, String userId) {
        String businessUserId = conversation.getBusinessProfile().getUser() != null
                ? conversation.getBusinessProfile().getUser().getId() : null;
        String creatorUserId = conversation.getCreatorProfile().getUser() != null
                ? conversation.getCreatorProfile().getUser().getId() : null;
        return userId.equals(businessUserId) || userId.equals(creatorUserId);
    }

    private ConversationDTO toConversationDTO(Conversation c) {
        return ConversationDTO.builder()
                .id(c.getId())
                .businessProfileId(c.getBusinessProfile().getId())
                .businessName(c.getBusinessProfile().getBusinessName())
                .creatorProfileId(c.getCreatorProfile().getId())
                .creatorName(c.getCreatorProfile().getName())
                .creatorProfileImageUrl(c.getCreatorProfile().getProfileImageUrl())
                .applicationId(c.getApplication() != null ? c.getApplication().getId() : null)
                .build();
    }

    private MessageDTO toMessageDTO(Message m) {
        return MessageDTO.builder()
                .id(m.getId())
                .conversationId(m.getConversation().getId())
                .senderId(m.getSender().getId())
                .content(m.getContent())
                .messageType(m.getMessageType())
                .fileUrl(m.getFileUrl())
                .sentAt(m.getCreatedAt())
                .build();
    }
}
