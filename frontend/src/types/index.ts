// ========================
// Core Types for PromoBridge
// ========================

// --- User & Auth ---
export type UserRole = 'BUSINESS' | 'CREATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// --- Business Profile ---
export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  category: string;
  description: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  gst?: string;
  isVerified: boolean;
  averageRating: number;
  campaignCount: number;
  completedCollaborations: number;
  responseRate: number;
  preferredLanguage?: string;
  businessSize?: string;
  budgetRange?: string;
  logoUrl?: string;
}

// --- Creator Profile ---
export interface CreatorProfile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  instagramUsername?: string;
  youtubeChannel?: string;
  followers: number;
  averageViews: number;
  engagementRate: number;
  location: string;
  city: string;
  state: string;
  minCollabAmount?: number;
  isVerified: boolean;
  responseTime?: string;
  averageRating: number;
  availability?: string;
  profileImageUrl?: string;
  categories?: string[];
  languages?: string[];
}

// --- Campaign ---
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type CampaignType = 'INSTAGRAM_REEL' | 'INSTAGRAM_STORY' | 'INSTAGRAM_POST' | 'YOUTUBE_SHORT' | 'YOUTUBE_VIDEO' | 'COMBO';
export type Platform = 'INSTAGRAM' | 'YOUTUBE' | 'BOTH';

export interface Campaign {
  id: string;
  businessId: string;
  businessName?: string;
  businessLogoUrl?: string;
  title: string;
  description: string;
  budget: number;
  campaignType: CampaignType;
  platform: Platform;
  location: string;
  isRemote: boolean;
  city?: string;
  deadline: string;
  deliverables?: string;
  creatorCategory?: string;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number;
  genderPreference?: string;
  languages?: string;
  specialInstructions?: string;
  status: CampaignStatus;
  createdAt: string;
  images?: CampaignImage[];
}

export interface CampaignImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

// --- Applications ---
export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface CampaignApplication {
  id: string;
  campaignId: string;
  creatorId: string;
  status: ApplicationStatus;
  message?: string;
  proposedRate?: number;
  aiMatchScore?: number;
  campaign?: Campaign;
  creator?: CreatorProfile;
  createdAt: string;
}

// --- Chat ---
export interface Conversation {
  id: string;
  applicationId?: string;
  businessId: string;
  creatorId: string;
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'DOCUMENT';
  fileUrl?: string;
  createdAt: string;
}

// --- Notifications ---
export type NotificationType =
  | 'CAMPAIGN_APPLIED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'INVITATION_RECEIVED'
  | 'MESSAGE_RECEIVED'
  | 'CAMPAIGN_CLOSED'
  | 'PROFILE_VERIFIED'
  | 'REMINDER'
  | 'AI_RECOMMENDATION';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

// --- Reviews ---
export interface Review {
  id: string;
  campaignId?: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// --- AI ---
export interface AIMatchScore {
  score: number;
  reasons: string[];
}

export interface AICampaignSuggestion {
  title: string;
  description: string;
  requirements: string;
  suggestedBudget: number;
  deliverables: string;
  timeline: string;
}

export interface AIProposal {
  content: string;
}

export interface AIPricingSuggestion {
  minPrice: number;
  maxPrice: number;
  recommendedPrice: number;
  reasoning: string;
}

export interface AICampaignPrediction {
  expectedReach: number;
  estimatedEngagement: number;
  audienceMatch: number;
  campaignQuality: number;
  confidence: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
  errors?: string[];
  path: string;
}

// --- Pagination ---
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
