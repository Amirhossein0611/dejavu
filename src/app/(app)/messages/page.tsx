"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Message = { id: number; from: "me" | "them"; text: string; time: string; };
type Chat = { id: number; name: string; username: string; lastMessage: string; time: string; unread: number; messages: Message[]; };

const INITIAL_CHATS: Chat[] = [
  {
    id: 1, name: "سارا", username: "sara_m", lastMessage: "ممنون از کامنتت 🙏", time: "۲ دقیقه پیش", unread: 2,
    messages: [
      { id: 1, from: "them", text: "سلام! پستت رو خوندم، خیلی تحت تأثیر قرار گرفتم.", time: "۱۰:۳۰" },
      { id: 2, from: "me", text: "ممنون، خوشحالم که دوست داشتی.", time: "۱۰:۳۲" },
      { id: 3, from: "them", text: "ممنون از کامنتت 🙏", time: "۱۰:۳۵" },
    ],
  },
  {
    id: 2, name: "علی", username: "ali_k", lastMessage: "آره دقیقاً همین حسو داشتم", time: "۱ ساعت پیش", unread: 0,
    messages: [
      { id: 1, from: "them", text: "شب اول مهاجرتم دقیقاً همین بود.", time: "دیروز" },
      { id: 2, from: "me", text: "می‌دونم چه حسی داره.", time: "دیروز" },
      { id: 3, from: "them", text: "آره دقیقاً همین حسو داشتم", time: "۱ ساعت پیش" },
    ],
  },
  {
    id: 3, name: "نیلوفر", username: "nilofar", lastMessage: "خیلی ممنون ❤️", time: "دیروز", unread: 1,
    messages: [
      { id: 1, from: "me", text: "پستت خیلی زیبا بود.", time: "دیروز" },
      { id: 2, from: "them", text: "خیلی ممنون ❤️", time: "دیروز" },
    ],
  },
];

const SAMPLE_USERS = [
  { name: "رضا غفاری", username: "reza_gh" },
  { name: "مریم نوری", username: "maryam_r" },
  { name: "کیان تهرانی", username: "kian_t" },
];

export default function MessagesPage() {
  const router = useRouter();
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("dj_username") || "");
    setAvatar(localStorage.getItem("dj_avatar") || "");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  function openChat(chat: Chat) {
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
    setActiveChat({ ...chat, unread: 0 });
    setShowSearch(false);
    setSearch("");
  }

  function startNewChat(user: { name: string; username: string }) {
    const existing = chats.find(c => c.username === user.username);
    if (existing) { openChat(existing); return; }
    const newChat: Chat = {
      id: Date.now(), name: user.name, username: user.username,
      lastMessage: "", time: "همین الان", unread: 0, messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setShowSearch(false);
    setSearch("");
  }

  function sendMessage() {
    if (!newMessage.trim() || !activeChat) return;
    const msg: Message = { id: Date.now(), from: "me", text: newMessage.trim(), time: "همین الان" };
    const updated = { ...activeChat, messages: [...activeChat.messages, msg], lastMessage: newMessage.trim(), time: "همین الان" };
    setActiveChat(updated);
    setChats(prev => prev.map(c => c.id === activeChat.id ? updated : c));
    setNewMessage("");
  }

  const filteredUsers = search.trim()
    ? SAMPLE_USERS.filter(u => u.name.includes(search) || u.username.toLowerCase().includes(search.toLowerCase()))
    : SAMPLE_USERS;

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  // صفحه چت باز
  if (activeChat) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">

        {/* هدر چت */}
        <div className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-[#111] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveChat(null)} className="text-[#e8e6e0]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button onClick={() => router.push(`/user/${activeChat.username}`)}
            className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#666] font-medium hover:opacity-80 transition-opacity">
            {activeChat.name.charAt(0)}
          </button>
          <div className="flex-1" dir="rtl">
            <button onClick={() => router.push(`/user/${activeChat.username}`)}
              className="text-sm font-medium text-[#e8e6e0] hover:underline block text-right">
              {activeChat.name}
            </button>
            <p className="text-xs text-[#444]">@{activeChat.username}</p>
          </div>
          <button onClick={() => router.push(`/user/${activeChat.username}`)}
            className="text-[#555] hover:text-[#e8e6e0] transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

        {/* پیام‌ها */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 pb-24">
          {activeChat.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-[#444] pt-10">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="text-sm" dir="rtl">شروع به گفتگو کن</p>
            </div>
          )}
          {activeChat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-6 ${
                msg.from === "me"
                  ? "bg-[#e8e6e0] text-[#0a0a0a] rounded-tl-sm"
                  : "bg-[#1a1a1a] text-[#e8e6e0] rounded-tr-sm"
              }`} dir="rtl">
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-[#666]" : "text-[#444]"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* فرم ارسال */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-[#0a0a0a] border-t border-[#111] px-4 py-3 flex gap-3 items-center">
          <button onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="w-9 h-9 bg-[#e8e6e0] rounded-full flex items-center justify-center text-[#0a0a0a] disabled:opacity-30 hover:opacity-85 transition-opacity flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
          <input
            type="text"
            placeholder="پیام بنویس..."
            dir="rtl"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-[#111] border border-[#1e1e1e] rounded-full px-4 py-2 text-sm text-[#e8e6e0] placeholder-[#333] outline-none focus:border-[#444] text-right"
          />
        </div>

      </main>
    );
  }

  // صفحه لیست چت‌ها
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">

      {/* هدر */}
      <div className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-[#111]">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-[#e8e6e0]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h1 className="text-base font-medium" dir="rtl">پیام‌ها</h1>
          </div>
          <button onClick={() => setShowSearch(!showSearch)}
            className="text-[#e8e6e0] hover:text-[#aaa] transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="12" y1="8" x2="12" y2="13"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </button>
        </div>

        {/* سرچ کاربر جدید */}
        {showSearch && (
          <div className="px-4 pb-3">
            <input
              type="text"
              placeholder="جستجوی کاربر برای چت جدید..."
              dir="rtl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-sm text-[#e8e6e0] placeholder-[#333] outline-none focus:border-[#444] text-right"
            />
            {search.trim() && (
              <div className="mt-2 bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#444] text-right" dir="rtl">کاربری پیدا نشد</p>
                ) : filteredUsers.map((user) => (
                  <button key={user.username} onClick={() => startNewChat(user)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] transition-colors border-b border-[#1e1e1e] last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#666] text-sm font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div dir="rtl" className="text-right">
                      <p className="text-sm text-[#e8e6e0]">{user.name}</p>
                      <p className="text-xs text-[#555]">@{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* لیست چت‌ها */}
      <div className="flex-1 pb-20">
        {chats.map((chat) => (
          <button key={chat.id} onClick={() => openChat(chat)}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-[#111] hover:bg-[#0f0f0f] transition-colors">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#666] font-medium">
                {chat.name.charAt(0)}
              </div>
              {chat.unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#cc2222] rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  {chat.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0" dir="rtl">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm ${chat.unread > 0 ? "font-semibold text-[#e8e6e0]" : "font-medium text-[#e8e6e0]"}`}>
                  {chat.name}
                </span>
                <span className="text-xs text-[#444]">{chat.time}</span>
              </div>
              <p className={`text-xs truncate text-right ${chat.unread > 0 ? "text-[#aaa]" : "text-[#555]"}`}>
                {chat.lastMessage || "گفتگو را شروع کن"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* نوار پایین */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
        {[
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round"/></svg>, path: "/feed", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, path: "/search", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg>, path: "/feed", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>, path: "/notifications", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg>, path: "/messages", active: true },
        ].map((item, i) => (
          <button key={i} onClick={() => router.push(item.path)}
            className={`flex-1 flex justify-center items-center py-3 transition-colors ${item.active ? "text-[#e8e6e0]" : "text-[#444] hover:text-[#888]"}`}>
            {item.icon}
          </button>
        ))}
      </div>

    </main>
  );
}