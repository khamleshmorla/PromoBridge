package com.promobridge.api.service;

import com.promobridge.api.dto.BusinessProfileDTO;
import com.promobridge.api.entity.BusinessProfile;
import com.promobridge.api.entity.User;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.mapper.ProfileMapper;
import com.promobridge.api.repository.BusinessProfileRepository;
import com.promobridge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BusinessProfileService {

    private final BusinessProfileRepository businessProfileRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;

    @Transactional(readOnly = true)
    public BusinessProfileDTO getProfileByUserId(String userId) {
        BusinessProfile profile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Business Profile not found for user: " + userId));
        return profileMapper.toBusinessProfileDTO(profile);
    }

    @Transactional
    public BusinessProfileDTO createProfile(String userId, BusinessProfileDTO dto) {
        if (businessProfileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Business Profile already exists for user: " + userId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        BusinessProfile profile = profileMapper.toBusinessProfileEntity(dto);
        profile.setUser(user);

        profile = businessProfileRepository.save(profile);
        return profileMapper.toBusinessProfileDTO(profile);
    }

    @Transactional
    public BusinessProfileDTO updateProfile(String userId, BusinessProfileDTO dto) {
        BusinessProfile profile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Business Profile not found for user: " + userId));

        profileMapper.updateBusinessProfileFromDTO(dto, profile);
        
        profile = businessProfileRepository.save(profile);
        return profileMapper.toBusinessProfileDTO(profile);
    }
}
