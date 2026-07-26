import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Star,
  MessageSquare, Zap, Clock, IndianRupee, CheckCircle2,
  Sparkles, ExternalLink
} from 'lucide-react';

const BASE = 'https://promobridge-api.onrender.com/api';

interface Creator {
  id: string;
  name: string;
  bio?: string;
  instagramUsername?: string;
  youtubeChannel?: string;
  followers?: number;
  averageViews?: number;
  engagementRate?: number | string;
  location?: string;
  city?: string;
  minCollabAmount?: number | string;
  availability?: string;
  responseTime?: string;
  averageRating?: number | string;
  profileImageUrl?: string;
  isVerified?: boolean;
}

function formatFollowers(n?: number) {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function Pill({ children, color = 'primary' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
      ${color === 'green' ? 'bg-emerald-500/10 text-emerald-600' :
        color === 'amber' ? 'bg-amber-500/10 text-amber-600' :
        'bg-primary/10 text-primary'}`}>
      {children}
    </span>
  );
}

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Try specific creator endpoint first, fallback to list search
        const res = await fetch(`${BASE}/discovery/creators?page=0&size=100`).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          const list: Creator[] = json?.data?.content ?? json?.content ?? [];
          const found = list.find((c) => c.id === id);
          if (found) {
            setCreator(found);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleContact = () => {
    // Navigate to messages page with creator pre-selected
    navigate(`/dashboard/messages?creatorId=${id}&creatorName=${encodeURIComponent(creator?.name ?? '')}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <p className="text-sm text-muted-foreground">Loading profile…</p>
    </div>
  );

  if (notFound || !creator) return (
    <div className="text-center py-24">
      <p className="text-muted-foreground">Creator profile not found.</p>
      <Link to="/dashboard/creators" className="mt-4 inline-block text-primary text-sm font-semibold hover:underline">
        ← Back to creators
      </Link>
    </div>
  );

  const rating = typeof creator.averageRating === 'number'
    ? creator.averageRating.toFixed(1)
    : creator.averageRating ?? '—';

  const minAmount = creator.minCollabAmount
    ? `₹${Number(creator.minCollabAmount).toLocaleString()}`
    : 'Negotiable';

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link to="/dashboard/creators"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to creators
        </Link>
      </motion.div>

      {/* Profile Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/50 bg-card overflow-hidden">
        {/* Banner gradient */}
        <div className="h-28 bg-gradient-to-br from-primary/20 via-violet-500/10 to-cyan-500/10" />

        <div className="px-6 pb-6">
          {/* Avatar overlap */}
          <div className="relative -mt-14 mb-4 flex items-end justify-between">
            {creator.profileImageUrl ? (
              <img src={creator.profileImageUrl} alt={creator.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-xl" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/20 flex items-center justify-center text-3xl font-bold text-primary border-4 border-card shadow-xl">
                {creator.name?.charAt(0)}
              </div>
            )}
            {creator.availability && (
              <Pill color="green">
                <CheckCircle2 className="w-3 h-3" /> {creator.availability}
              </Pill>
            )}
          </div>

          {/* Name & handle */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{creator.name}</h1>
                {creator.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20" />
                )}
              </div>
              {creator.instagramUsername && (
                <a href={`https://instagram.com/${creator.instagramUsername}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  @{creator.instagramUsername} on Instagram
                </a>
              )}
              {creator.youtubeChannel && (
                <a href={`https://youtube.com/${creator.youtubeChannel}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-red-500 flex items-center gap-1 mt-0.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  YouTube: {creator.youtubeChannel}
                </a>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button onClick={handleContact}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                <MessageSquare className="w-4 h-4" /> Send Message
              </button>
            </div>
          </div>

          {/* Location */}
          {creator.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
              <MapPin className="w-3.5 h-3.5" /> {creator.location}
            </div>
          )}

          {/* Bio */}
          {creator.bio && (
            <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{creator.bio}</p>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Followers', value: formatFollowers(creator.followers), color: 'from-violet-500 to-purple-600' },
          { icon: Star, label: 'Rating', value: rating, color: 'from-amber-400 to-orange-500' },
          { icon: Zap, label: 'Avg Views', value: formatFollowers(creator.averageViews), color: 'from-cyan-500 to-blue-500' },
          { icon: IndianRupee, label: 'Min Collab', value: minAmount, color: 'from-emerald-500 to-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/50 bg-card p-4 text-center">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Additional Details */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Creator Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {creator.responseTime && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <div className="text-[11px] text-muted-foreground">Response Time</div>
                <div className="font-semibold">{creator.responseTime}</div>
              </div>
            </div>
          )}

          {creator.engagementRate && Number(creator.engagementRate) > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Zap className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <div className="text-[11px] text-muted-foreground">Engagement Rate</div>
                <div className="font-semibold">{Number(creator.engagementRate).toFixed(1)}%</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <IndianRupee className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-[11px] text-muted-foreground">Min. Collaboration Budget</div>
              <div className="font-semibold">{minAmount}</div>
            </div>
          </div>

          {creator.availability && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <div className="text-[11px] text-muted-foreground">Status</div>
                <div className="font-semibold text-emerald-600">{creator.availability}</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold">Ready to collaborate?</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Start a conversation with {creator.name} about your campaign.
          </p>
        </div>
        <button onClick={handleContact}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <MessageSquare className="w-4 h-4" /> Message {creator.name.split(' ')[0]}
        </button>
      </motion.div>
    </div>
  );
}
