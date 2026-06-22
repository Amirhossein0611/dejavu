"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Notif = {
  id: number;
  type: "like" | "comment" | "follow" | "repost";
  name: string;
  username: string;
  text?: string;
  time: string;
  read: boolean;
};

const SAMPLE_NOTIFS: Notif[] = [
  { id: 1, type: "like", name: "سارا", username: "sara_m", text: "گاهی فکر می‌کنم بزرگ‌ترین شجاعت...", time: "۲ دقیقه پیش", read: false },
  { id: 2, type: "follow", name: "علی کریمی", username: "ali_k", time: "۱۵ دقیقه پیش", read: false },
  { id: 3, type: "comment", name: "نیلوفر", username: "nilofar", text: "خیلی زیبا نوشتی، دلم لرزید.", time: "۳۰ دقیقه پیش", read: false },
  { id: 4, type: "repost", name: "رضا غفاری", username: "reza_gh", text: "شب اول مهاجرت...", time: "۱ ساعت پیش", read: true },
  { id: 5, type: "like", name: "مریم نوری", username: "maryam_r", text: "مامانم همیشه می‌گفت گریه کردن ضعفه...", time: "۲ ساعت پیش", read: true },
  { id: 6, type: "follow", name: "کیان تهرانی", username: "kian_t", time: "۳ ساعت پیش", read: true },
  { id: 7, type: "comment", name: "سارا", username: "sara_m", text: "منم همین حسو داشتم روز اول.", time: "دیروز", read: true },
  { id: 8, type: "like", name: "علی کریمی", username: "ali_k", text: "استادم گفت هیچ‌وقت نویسنده نمی‌شی...", time: "دیروز", read: true },
];

function NotifIcon({ type }: { type: Notif["type"] }) {
  if (type === "like") return (
    <div className="w-8 h-8 rounded-full bg-[#1a0000] flex items-center justify-center flex-shrink-0">
      <svg width="15" height="15" fill="#cc2222" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </div>
  );
  if (type === "comment") return (
    <div className="w-8 h-8 rounded-full bg-[#001a1a] flex items-center justify-center flex-shrink-0">
      <svg width="15" height="15" fill="none" stroke="#1D9E75" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
  );
  if (type === "follow") return (
    <div className="w-8 h-8 rounded-full bg-[#1a1a00] flex items-center justify-center flex-shrink-0">
      <svg width="15" height="15" fill="none" stroke="#EF9F27" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-full bg-[#001a00] flex items-center justify-center flex-shrink-0">
      <svg width="15" height="15" fill="none" stroke="#639922" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    </div>
  );
}

function notifText(n: Notif): string {
  if (n.type === "like") return `پست تو رو لایک کرد`;
  if (n.type === "comment") return `روی پستت کامنت گذاشت`;
  if (n.type === "follow") return `شروع به دنبال کردنت کرد`;
  if (n.type === "repost") return `پستت رو ریپوست کرد`;
  return "";
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(SAMPLE_NOTIFS);
  const [tab, setTab] = useState(0);

  const unread = notifs.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  const filtered = tab === 0 ? notifs : notifs.filter((n) => !n.read);

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
            <div dir="rtl">
              <h1 className="text-base font-medium">اعلان‌ها</h1>
              {unread > 0 && <p className="text-xs text-[#555]">{unread} اعلان خوانده‌نشده</p>}
            </div>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-[#888] hover:text-[#e8e6e0] transition-colors" dir="rtl">
              همه رو خواندم
            </button>
          )}
        </div>

        {/* تب‌ها */}
        <div className="flex">
          {["همه", "خوانده‌نشده"].map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex-1 py-2.5 text-sm relative transition-colors ${tab === i ? "text-[#e8e6e0] font-medium" : "text-[#555]"}`}>
              {t}
              {i === 1 && unread > 0 && (
                <span className="ml-1.5 text-xs bg-[#cc2222] text-white rounded-full px-1.5 py-0.5">{unread}</span>
              )}
              {tab === i && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#e8e6e0] rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* لیست اعلان‌ها */}
      <div className="flex-1 pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-[#444]">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p className="text-sm" dir="rtl">اعلان جدیدی نداری</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-3 px-4 py-3.5 border-b border-[#111] cursor-pointer transition-colors hover:bg-[#0f0f0f] ${!notif.read ? "bg-[#0d0d0d]" : ""}`}>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#cc2222] flex-shrink-0 mt-3" />
              )}
              {notif.read && <div className="w-2 flex-shrink-0" />}

              <NotifIcon type={notif.type} />

              <div className="flex-1 min-w-0" dir="rtl">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-[#e8e6e0] leading-6">
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/user/${notif.username}`); }}
                      className="font-medium hover:underline">{notif.name}</button>
                    {" "}{notifText(notif)}
                  </p>
                  <span className="text-xs text-[#444] flex-shrink-0 mt-1">{notif.time}</span>
                </div>
                {notif.text && (
                  <p className="text-xs text-[#555] mt-1 truncate">{notif.text}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* نوار پایین */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
        {[
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round"/></svg>, path: "/feed", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, path: "/search", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg>, path: "/feed", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>, path: "/notifications", active: true },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg>, path: "/messages", active: false },
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