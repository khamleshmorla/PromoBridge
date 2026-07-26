-- V1: Initial Schema for PromoBridge

-- ==========================================
-- 1. ENUMS (Used directly as VARCHAR in tables, but defining types for clarity is an option. We will use VARCHAR for flexibility with JPA)
-- ==========================================

-- ==========================================
-- 2. CORE USERS
-- ==========================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Clerk ID usually string, not UUID
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_user_email ON users(email);

-- ==========================================
-- 3. PROFILES
-- ==========================================
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id),
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    gst VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    average_rating NUMERIC(3,2) DEFAULT 0.0,
    campaign_count INTEGER DEFAULT 0,
    completed_collaborations INTEGER DEFAULT 0,
    response_rate NUMERIC(5,2) DEFAULT 100.00,
    preferred_language VARCHAR(100),
    business_size VARCHAR(50),
    budget_range VARCHAR(100),
    logo_url VARCHAR(1024),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);

CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    instagram_username VARCHAR(255),
    youtube_channel VARCHAR(255),
    followers INTEGER DEFAULT 0,
    average_views INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0.00,
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    min_collab_amount NUMERIC(12,2),
    is_verified BOOLEAN DEFAULT FALSE,
    response_time VARCHAR(100),
    average_rating NUMERIC(3,2) DEFAULT 0.0,
    availability VARCHAR(100),
    profile_image_url VARCHAR(1024),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_creator_location ON creator_profiles(city);
CREATE INDEX idx_creator_followers ON creator_profiles(followers);

-- ==========================================
-- 4. CATEGORIES & LANGUAGES
-- ==========================================
CREATE TABLE creator_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    category VARCHAR(100) NOT NULL
);
CREATE INDEX idx_creator_category ON creator_categories(category);

CREATE TABLE creator_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    language VARCHAR(100) NOT NULL
);

-- ==========================================
-- 5. PORTFOLIO & SOCIAL
-- ==========================================
CREATE TABLE portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(1024) NOT NULL,
    link VARCHAR(1024),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);

CREATE TABLE creator_social_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    platform VARCHAR(50) NOT NULL,
    handle VARCHAR(255) NOT NULL,
    followers INTEGER DEFAULT 0,
    url VARCHAR(1024),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);

-- ==========================================
-- 6. CAMPAIGNS
-- ==========================================
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business_profiles(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC(12,2),
    campaign_type VARCHAR(100),
    platform VARCHAR(100),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT TRUE,
    city VARCHAR(100),
    deadline TIMESTAMP,
    deliverables TEXT,
    creator_category VARCHAR(100),
    min_followers INTEGER,
    max_followers INTEGER,
    min_engagement_rate NUMERIC(5,2),
    gender_preference VARCHAR(50),
    languages VARCHAR(255),
    special_instructions TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_campaign_status ON campaigns(status);
CREATE INDEX idx_campaign_business ON campaigns(business_id);
CREATE INDEX idx_campaign_city ON campaigns(city);

CREATE TABLE campaign_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    image_url VARCHAR(1024) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 7. APPLICATIONS
-- ==========================================
CREATE TABLE campaign_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    message TEXT,
    proposed_rate NUMERIC(12,2),
    ai_match_score INTEGER,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0,
    UNIQUE(campaign_id, creator_id)
);
CREATE INDEX idx_app_campaign ON campaign_applications(campaign_id);
CREATE INDEX idx_app_creator ON campaign_applications(creator_id);
CREATE INDEX idx_app_status ON campaign_applications(status);

-- ==========================================
-- 8. BOOKMARKS
-- ==========================================
CREATE TABLE saved_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business_profiles(id),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 9. CHAT SYSTEM
-- ==========================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES campaign_applications(id),
    business_id UUID NOT NULL REFERENCES business_profiles(id),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_conv_bus ON conversations(business_id);
CREATE INDEX idx_conv_cre ON conversations(creator_id);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    last_read_message_id UUID,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id VARCHAR(255) NOT NULL REFERENCES users(id),
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'TEXT',
    file_url VARCHAR(1024),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_msg_conv ON messages(conversation_id);
CREATE INDEX idx_msg_created ON messages(created_at);

-- ==========================================
-- 10. REVIEWS
-- ==========================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    reviewer_id VARCHAR(255) NOT NULL REFERENCES users(id),
    reviewee_id VARCHAR(255) NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_review_reviewee ON reviews(reviewee_id);

CREATE TABLE review_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id),
    replier_id VARCHAR(255) NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);

-- ==========================================
-- 11. NOTIFICATIONS
-- ==========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 0
);
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_read ON notifications(is_read);

-- ==========================================
-- 12. LOGS & SETTINGS
-- ==========================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details TEXT,
    ip_address VARCHAR(100),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INTEGER DEFAULT 0
);

-- Note: Since we are using Clerk for auth, tables like EmailVerification, 
-- PasswordResetToken, and RefreshToken are not strictly necessary 
-- locally, but can be added if custom auth fallback is required.
