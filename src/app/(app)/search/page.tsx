"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLE_USERS = [
  { name: "سارا محمدی", username: "sara_m", bio: "نویسنده | عاشق قهوه و کتاب", followers: 1240 },
  { name: "علی کریمی", username: "ali_k", bio: "مهاجر | داستان‌نویس", followers: 873 },
  { name: "نیلوفر رضایی", username: "nilofar", bio: "شعر می‌نویسم وقتی دلم می‌گیره", followers: 3400 },
  { name: "رضا غفاری", username: "reza_gh", bio: "نویسنده کتاب «باران بی‌موقع»", followers: 5100 },
  { name: "مریم نوری", username: "maryam_r", bio: "روان‌شناس | مادر | داستان‌پرداز", followers: 920 },
  { name: "کیان تهرانی", username: "kian_t", bio: "موسیقی‌دان و نویسنده", followers: 2100 },
];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [followed, setFollowed] = useState<string[]>([]);

  const filtered = query.trim()
    ? SAMPLE_USERS.filter(
        (u) =>
          u.name.includes(query) ||
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.bio.includes(query)
      )
    : SAMPLE_USERS;

  function toggleFollow(username: string) {
    setFollowed((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  }

  function formatFollowers(n: number) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " هزار";
    return n.toString();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">

      {/* هدر */}
      <div className="sticky top-0 bg-[#0a0a0a] z-10 px-4 pt-4 pb-3 border-b border-[#111]">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => router.back()} className="text-[#e8e6e0]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 className="text-base font-medium">جستجو</h1>
        </div>

        {/* باکس سرچ */}
        <div className="relative">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444]" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="جستجوی یوزرنیم یا نام..."
            dir="rtl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl pr-10 pl-4 py-2.5 text-sm text-[#e8e6e0] placeholder-[#333] outline-none focus:border-[#444] text-right"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888]">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* نتایج */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-[#444]">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-sm" dir="rtl">کاربری با این مشخصات پیدا نشد</p>
          </div>
        ) : (
          filtered.map((user) => (
            <div key={user.username} className="flex items-center gap-3 px-4 py-3 border-b border-[#111] hover:bg-[#0f0f0f] transition-colors">

              {/* آواتار */}
              <button onClick={() => router.push(`/user/${user.username}`)}
                className="w-11 h-11 rounded-full bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center text-[#666] font-medium text-base hover:opacity-80 transition-opacity">
                {user.name.charAt(0)}
              </button>

              {/* اطلاعات */}
              <div className="flex-1 min-w-0" dir="rtl">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => router.push(`/user/${user.username}`)}
                    className="text-sm font-medium text-[#e8e6e0] hover:underline truncate">
                    {user.name}
                  </button>
                </div>
                <p className="text-xs text-[#555]">@{user.username}</p>
                <p className="text-xs text-[#444] mt-0.5 truncate">{user.bio}</p>
                <p className="text-xs text-[#333] mt-0.5">{formatFollowers(user.followers)} دنبال‌کننده</p>
              </div>

              {/* دکمه فالو */}
              <button
                onClick={() => toggleFollow(user.username)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  followed.includes(user.username)
                    ? "bg-transparent border border-[#444] text-[#888]"
                    : "bg-[#e8e6e0] text-[#0a0a0a]"
                }`}
              >
                {followed.includes(user.username) ? "دنبال‌شده" : "دنبال کن"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* نوار پایین */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
        {[
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, path: "/feed", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, path: "/search", active: true },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg>, path: "/feed", active: false },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>, path: "/notifications", active: false },
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