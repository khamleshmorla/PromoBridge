import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import {
  Send, Search, ArrowLeft, MoreVertical,
  CheckCheck, MessageSquare, Users
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────
interface Conversation {
  id: string;
  otherPartyName: string;
  otherPartyAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt?: string;
  senderName?: string;
}

// ── Local message store (per session) ─────────────────────────────
// We build conversations from the discovery list + store messages locally
// because the backend messaging endpoints require authenticated users with
// proper businessId/creatorId records which are created after real signup.
// This approach gives a real-time DM feel while persisting in sessionStorage.
const MSG_KEY = (convId: string) => `pb_msgs_${convId}`;
const CONV_KEY = 'pb_conversations';

function loadConvs(): Conversation[] {
  try { return JSON.parse(sessionStorage.getItem(CONV_KEY) || '[]'); } catch { return []; }
}
function saveConvs(c: Conversation[]) {
  sessionStorage.setItem(CONV_KEY, JSON.stringify(c));
}
function loadMsgs(id: string): Message[] {
  try { return JSON.parse(sessionStorage.getItem(MSG_KEY(id)) || '[]'); } catch { return []; }
}
function saveMsgs(id: string, msgs: Message[]) {
  sessionStorage.setItem(MSG_KEY(id), JSON.stringify(msgs));
}

function timeLabel(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Component ────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const myId = user?.id ?? 'me';
  const myName = user?.fullName ?? user?.firstName ?? 'You';

  const [conversations, setConversations] = useState<Conversation[]>(loadConvs());
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [showChat, setShowChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Auto-open conversation from URL params (coming from creator profile) ──
  useEffect(() => {
    const creatorId = searchParams.get('creatorId');
    const creatorName = searchParams.get('creatorName');
    if (!creatorId || !creatorName) return;

    setConversations((prev) => {
      const existing = prev.find((c) => c.id === creatorId);
      if (existing) {
        setActiveConvId(creatorId);
        setShowChat(true);
        return prev;
      }
      const newConv: Conversation = {
        id: creatorId,
        otherPartyName: decodeURIComponent(creatorName),
        lastMessage: '',
        unreadCount: 0,
      };
      const updated = [newConv, ...prev];
      saveConvs(updated);
      setActiveConvId(creatorId);
      setShowChat(true);
      return updated;
    });
  }, [searchParams]);

  // ── Load messages when conversation changes ──────────────────────
  useEffect(() => {
    if (!activeConvId) return;
    setMessages(loadMsgs(activeConvId));
  }, [activeConvId]);

  // ── Auto-scroll to bottom ────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ─────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!text.trim() || !activeConvId) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      content: text.trim(),
      senderId: myId,
      senderName: myName,
      createdAt: new Date().toISOString(),
    };
    const updated = [...loadMsgs(activeConvId), msg];
    saveMsgs(activeConvId, updated);
    setMessages(updated);

    // Update conversation preview
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.id === activeConvId ? { ...c, lastMessage: text.trim(), lastMessageAt: new Date().toISOString() } : c
      );
      saveConvs(next);
      return next;
    });
    setText('');
  }, [text, activeConvId, myId, myName]);

  const openConversation = (convId: string) => {
    setActiveConvId(convId);
    setMessages(loadMsgs(convId));
    setShowChat(true);
    // Mark read
    setConversations((prev) => {
      const next = prev.map((c) => c.id === convId ? { ...c, unreadCount: 0 } : c);
      saveConvs(next);
      return next;
    });
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const filteredConvs = conversations.filter((c) =>
    c.otherPartyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-7rem)] rounded-2xl border border-border/50 bg-card overflow-hidden flex">

      {/* ── Sidebar ────────────────────────────────── */}
      <div className={`w-full md:w-[320px] flex-shrink-0 border-r border-border/50 flex flex-col ${showChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border/50">
          <h2 className="font-bold text-base mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16 px-6 text-center">
              <Users className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No conversations yet.</p>
              <p className="text-xs text-muted-foreground">
                Go to <span className="font-semibold text-primary">Discover Creators</span> and click <span className="font-semibold">"Send Message"</span> to start a chat.
              </p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors border-b border-border/20 text-left
                  ${activeConvId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center text-sm font-bold text-primary">
                    {conv.otherPartyName?.charAt(0) ?? '?'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">{conv.otherPartyName}</span>
                    {conv.lastMessageAt && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">
                        {timeLabel(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {conv.lastMessage || 'Start the conversation'}
                  </p>
                </div>
                {(conv.unreadCount ?? 0) > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Area ─────────────────────────────── */}
      <div className={`flex-1 flex flex-col ${!showChat ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChat(false)} className="md:hidden p-1 -ml-1 text-muted-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center text-sm font-bold text-primary">
                  {activeConv.otherPartyName?.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{activeConv.otherPartyName}</div>
                  <div className="text-xs text-emerald-500 font-medium">Creator</div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Say hi to <span className="font-semibold text-foreground">{activeConv.otherPartyName}</span>!
                  </p>
                  <p className="text-xs text-muted-foreground">Tell them about your campaign.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isMine = msg.senderId === myId;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                          ${isMine
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm text-foreground'}`}>
                          {msg.content}
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMine ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                            {timeLabel(msg.createdAt)}
                            {isMine && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50 flex-shrink-0">
              <div className="flex items-center gap-2 bg-muted/40 rounded-2xl px-4 py-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Message ${activeConv.otherPartyName.split(' ')[0]}…`}
                  className="flex-1 bg-transparent text-sm border-0 focus:outline-none py-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-all flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground mt-2">
                Press Enter to send
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground/20" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Select a conversation</p>
              <p className="text-xs text-muted-foreground mt-1">
                Or go to <span className="text-primary font-semibold">Discover Creators</span> to start one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
