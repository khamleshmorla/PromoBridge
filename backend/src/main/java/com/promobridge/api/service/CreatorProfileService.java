package com.promobridge.api.service;

import com.promobridge.api.dto.CreatorProfileDTO;
import com.promobridge.api.entity.CreatorProfile;
import com.promobridge.api.entity.User;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.mapper.ProfileMapper;
import com.promobridge.api.repository.CreatorProfileRepository;
import com.promobridge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreatorProfileService {

    private final CreatorProfileRepository creatorProfileRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;

    @Transactional(readOnly = true)
    public CreatorProfileDTO getProfileByUserId(String userId) {
        CreatorProfile profile = creatorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Creator Profile not found for user: " + userId));
        return profileMapper.toCreatorProfileDTO(profile);
    }

    @Transactional
    public CreatorProfileDTO createProfile(String userId, CreatorProfileDTO dto) {
        if (creatorProfileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Creator Profile already exists for user: " + userId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        CreatorProfile profile = profileMapper.toCreatorProfileEntity(dto);
        profile.setUser(user);

        profile = creatorProfileRepository.save(profile);
        return profileMapper.toCreatorProfileDTO(profile);
    }

    @Transactional
    public CreatorProfileDTO updateProfile(String userId, CreatorProfileDTO dto) {
        CreatorProfile profile = creatorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Creator Profile not found for user: " + userId));

        profileMapper.updateCreatorProfileFromDTO(dto, profile);
        
        profile = creatorProfileRepository.save(profile);
        return profileMapper.toCreatorProfileDTO(profile);
    }
}
