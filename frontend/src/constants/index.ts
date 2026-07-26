export const APP_NAME = 'PromoBridge';
export const APP_TAGLINE = 'AI-Powered Influencer Collaboration Marketplace';

export const CREATOR_CATEGORIES = [
  'Fashion & Beauty',
  'Food & Cooking',
  'Travel & Adventure',
  'Technology',
  'Gaming',
  'Health & Fitness',
  'Education',
  'Entertainment',
  'Music',
  'Art & Design',
  'Business & Finance',
  'Lifestyle',
  'Comedy',
  'Sports',
  'News & Politics',
  'Photography',
  'Parenting',
  'Pets & Animals',
  'Science',
  'DIY & Crafts',
] as const;

export const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali',
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi',
  'Urdu', 'Odia', 'Assamese',
] as const;

export const CAMPAIGN_TYPES = [
  { value: 'INSTAGRAM_REEL', label: 'Instagram Reel' },
  { value: 'INSTAGRAM_STORY', label: 'Instagram Story' },
  { value: 'INSTAGRAM_POST', label: 'Instagram Post' },
  { value: 'YOUTUBE_SHORT', label: 'YouTube Short' },
  { value: 'YOUTUBE_VIDEO', label: 'YouTube Video' },
  { value: 'COMBO', label: 'Combo Package' },
] as const;

export const APPLICATION_STATUSES = {
  APPLIED: { label: 'Applied', color: 'bg-blue-500' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-amber-500' },
  ACCEPTED: { label: 'Accepted', color: 'bg-emerald-500' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500' },
  COMPLETED: { label: 'Completed', color: 'bg-purple-500' },
} as const;

export const CAMPAIGN_STATUSES = {
  DRAFT: { label: 'Draft', color: 'bg-gray-500' },
  ACTIVE: { label: 'Active', color: 'bg-emerald-500' },
  PAUSED: { label: 'Paused', color: 'bg-amber-500' },
  COMPLETED: { label: 'Completed', color: 'bg-blue-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
} as const;
