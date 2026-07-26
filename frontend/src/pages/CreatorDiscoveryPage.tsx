import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Users as UsersIcon, Sparkles, MessageSquare,
  Star, X, SlidersHorizontal, ChevronDown, UserCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ──────────────────────────────────────────────
// Always use the live Render API — no env fallback
// ──────────────────────────────────────────────
const BASE = 'https://promobridge-api.onrender.com/api';

interface CreatorItem {
  id: string;
  name: string;
  bio?: string;
  followers?: number;
  location?: string;
  instagramUsername?: string;
  profileImageUrl?: string;
  averageRating?: number | string;
  availability?: string;
}

function formatFollowers(n?: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

const CATEGORIES = [
  'Lifestyle', 'Tech & Gadgets', 'Fitness & Health',
  'Food & Dining', 'Fashion & Style', 'Gaming & Esports',
  'Travel & Adventure', 'Beauty & Makeup',
];

// Maps which bio keywords correspond to each category chip
const CAT_KEYWORDS: Record<string, string[]> = {
  'Lifestyle':        ['lifestyle', 'daily', 'vlogs'],
  'Tech & Gadgets':   ['tech', 'gadget', 'reviewer', 'unboxing'],
  'Fitness & Health': ['fitness', 'wellness', 'workout', 'meal'],
  'Food & Dining':    ['food', 'dining', 'restaurant', 'street food'],
  'Fashion & Style':  ['fashion', 'style', 'lookbook', 'outfit'],
  'Gaming & Esports': ['gaming', 'streamer', 'esport', 'gameplay'],
  'Travel & Adventure':['travel', 'wanderlust', 'landscape', 'adventure'],
  'Beauty & Makeup':  ['beauty', 'makeup', 'skincare'],
};

export default function CreatorDiscoveryPage() {
  const navigate = useNavigate();
  const [allCreators, setAllCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ALL pages from the API ─────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        setError('');
        // Fetch up to 100 creators in one call
        const res = await fetch(`${BASE}/discovery/creators?page=0&size=100`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const raw: CreatorItem[] = json?.data?.content ?? json?.content ?? [];
        // Deduplicate by id
        const seen = new Set<string>();
        const list = raw.filter((c) => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
        setAllCreators(list);
      } catch (e) {
        setError('Could not load creators. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // ── Filtering logic ───────────────────────────────────────────────
  const filtered = allCreators.filter((c) => {
    const q = query.trim().toLowerCase();

    // Search: match name, @handle, bio, location
    const matchesSearch =
      !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.instagramUsername || '').toLowerCase().includes(q) ||
      (c.bio || '').toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q);

    // Category chip filter
    const matchesCategory =
      category === 'ALL' ||
      (CAT_KEYWORDS[category] || []).some((kw) =>
        (c.bio || '').toLowerCase().includes(kw)
      );

    return matchesSearch && matchesCategory;
  });

  // ── Instagram-style live suggestions (name + @handle) ────────────
  const suggestions = query.trim().length > 0
    ? allCreators.filter((c) => {
        const q = query.trim().toLowerCase();
        return (
          (c.name || '').toLowerCase().includes(q) ||
          (c.instagramUsername || '').toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  const handleSuggestionClick = useCallback((creator: CreatorItem) => {
    setQuery(creator.name);
    setShowSuggestions(false);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6 max-w-7xl" onClick={() => setShowSuggestions(false)}>

      {/* ── Header ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Discover Creators</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {loading ? 'Loading…' : `${allCreators.length} creators live from database`}
        </p>
      </motion.div>

      {/* ── Search bar with live suggestions ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name, @username, location…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
          />
          {query && (
            <button onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live suggestion dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="absolute z-50 top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSuggestionClick(c)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left"
                >
                  {c.profileImageUrl ? (
                    <img src={c.profileImageUrl} alt={c.name}
                      className="w-9 h-9 rounded-full object-cover border border-primary/20 flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {c.name?.charAt(0) ?? 'C'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">@{c.instagramUsername} · {c.location}</p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                    {formatFollowers(c.followers)} followers
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Category chips ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        <span className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
        </span>
        {['ALL', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              category === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {cat === 'ALL' ? 'All Categories' : cat}
          </button>
        ))}
      </motion.div>

      {/* ── Stats bar ───────────────────────────── */}
      {!loading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ChevronDown className="w-3.5 h-3.5" />
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {allCreators.length} creators
          {query && <> matching <span className="font-semibold text-primary">"{query}"</span></>}
          {category !== 'ALL' && <> in <span className="font-semibold text-primary">{category}</span></>}
        </div>
      )}

      {/* ── Content ─────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading creators from database…</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 border border-dashed border-destructive/40 rounded-2xl">
          <p className="text-destructive font-medium text-sm">{error}</p>
          <button onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/60 rounded-2xl bg-card/50">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-semibold">No creators found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different search term or change the category filter.
          </p>
          <button onClick={clearSearch}
            className="mt-4 px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="group p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl transition-all flex flex-col gap-4"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                {c.profileImageUrl ? (
                  <img src={c.profileImageUrl} alt={c.name}
                    className="w-13 h-13 w-[52px] h-[52px] rounded-full object-cover border-2 border-primary/20 flex-shrink-0" />
                ) : (
                  <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                    {c.name?.charAt(0) ?? 'C'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">@{c.instagramUsername ?? 'creator'}</p>
                </div>
                {c.averageRating && (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-500" />
                    {typeof c.averageRating === 'number' ? c.averageRating.toFixed(1) : c.averageRating}
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed -mt-1">
                {c.bio ?? 'Content creator available for brand collaborations.'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/40 pt-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Followers</span>
                  <span className="font-bold flex items-center gap-1 text-foreground">
                    <UsersIcon className="w-3 h-3 text-primary" />
                    {formatFollowers(c.followers)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Location</span>
                  <span className="font-semibold flex items-center gap-1 text-foreground truncate">
                    <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="truncate">{c.location ?? 'Remote'}</span>
                  </span>
                </div>
              </div>

              {/* Availability badge */}
              {c.availability && (
                <span className="self-start text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full -mt-1">
                  ✓ {c.availability}
                </span>
              )}

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={`/dashboard/creators/${c.id}`}
                  className="py-2 rounded-xl bg-muted/70 text-foreground text-xs font-semibold hover:bg-muted transition-all flex items-center justify-center gap-1.5">
                  <UserCircle className="w-3.5 h-3.5" /> View Profile
                </Link>
                <button
                  onClick={() => navigate(`/dashboard/messages?creatorId=${c.id}&creatorName=${encodeURIComponent(c.name)}`)}
                  className="py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
