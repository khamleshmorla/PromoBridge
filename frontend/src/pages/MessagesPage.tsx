import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Image, Smile, Paperclip, Search, Phone, Video, MoreVertical,
  ArrowLeft, CheckCheck, Circle
} from 'lucide-react';

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
}

const mockContacts: ChatContact[] = [
  { id: '1', name: 'Ananya Verma', lastMessage: 'Sounds great! Let me share my portfolio.', time: '2 min', unread: 2, online: true, avatar: 'A' },
  { id: '2', name: 'Karthik Rajan', lastMessage: 'When do you need the deliverables?', time: '1 hr', unread: 0, online: true, avatar: 'K' },
  { id: '3', name: 'Divya Singh', lastMessage: 'I\'ll send the reel draft by tomorrow', time: '3 hr', unread: 0, online: false, avatar: 'D' },
  { id: '4', name: 'Rohit Sharma', lastMessage: 'Thanks for the collaboration! 🎉', time: '1 day', unread: 0, online: false, avatar: 'R' },
];

const mockMessages = [
  { id: '1', senderId: 'me', content: 'Hi Ananya! I loved your recent fashion content. Would you be interested in a collaboration for our summer collection?', time: '10:30 AM', read: true },
  { id: '2', senderId: 'other', content: 'Thank you so much! I\'d love to hear more about the campaign. What kind of content are you looking for?', time: '10:32 AM', read: true },
  { id: '3', senderId: 'me', content: 'We\'re looking for 2 Instagram Reels and 3 Stories showcasing our new summer line. Budget is ₹15,000.', time: '10:35 AM', read: true },
  { id: '4', senderId: 'other', content: 'That sounds great! Let me share my portfolio. I have experience with similar fashion brands.', time: '10:38 AM', read: true },
  { id: '5', senderId: 'other', content: 'Here\'s my latest lookbook reel — it got 50K views in 24 hours! I can create something similar for your brand. 📸', time: '10:40 AM', read: false },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const activeContact = mockContacts.find((c) => c.id === selectedChat);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] rounded-2xl border border-border/50 bg-card overflow-hidden flex">
      {/* Sidebar: Conversations */}
      <div className={`w-full md:w-[340px] border-r border-border/50 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Search */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {mockContacts.map((contact) => (
            <button key={contact.id} onClick={() => { setSelectedChat(contact.id); setShowMobileChat(true); }}
              className={`w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors border-b border-border/20 text-left
                ${selectedChat === contact.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-card rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm truncate">{contact.name}</span>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{contact.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full flex-shrink-0">{contact.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-border/50">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobileChat(false)} className="md:hidden p-1">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                    {activeContact.avatar}
                  </div>
                  {activeContact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />}
                </div>
                <div>
                  <div className="font-semibold text-sm">{activeContact.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {activeContact.online ? (
                      <><Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online</>
                    ) : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors"><Phone className="w-4 h-4 text-muted-foreground" /></button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors"><Video className="w-4 h-4 text-muted-foreground" /></button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {mockMessages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.senderId === 'me'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted/50 rounded-bl-md'}`}>
                    {msg.content}
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                      {msg.senderId === 'me' && <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-blue-300' : ''}`} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"><Paperclip className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"><Image className="w-5 h-5" /></button>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"><Smile className="w-5 h-5" /></button>
                <button onClick={handleSend}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
