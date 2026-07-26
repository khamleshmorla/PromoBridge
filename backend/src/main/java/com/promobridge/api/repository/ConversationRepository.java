package com.promobridge.api.repository;

import com.promobridge.api.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query("SELECT c FROM Conversation c WHERE c.businessProfile.user.id = :userId OR c.creatorProfile.user.id = :userId")
    Page<Conversation> findByParticipantUserId(@Param("userId") String userId, Pageable pageable);
}
