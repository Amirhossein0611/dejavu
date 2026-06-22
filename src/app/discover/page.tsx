"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: 1, title: "عشق و روابط", emoji: "❤️", count: "۱۲ هزار پست", posts: [
    { id: 1, name: "سارا", username: "sara_m", text: "عشق یعنی وقتی می‌دونی طرف مقابلت کامل نیست، ولی برات کامله.", likes: 2400 },
    { id: 2, name: "نیلوفر", username: "nilofar", text: "بعضی آدم‌ها مثل پاییزن. زیبان ولی موندگار نیستن.", likes: 1800 },
  ]},
  { id: 2, title: "تنهایی", emoji: "🌙", count: "۸ هزار پست", posts: [
    { id: 3, name: "علی", username: "ali_k", text: "تنهایی یعنی وقط وسط جمع باشی و حس کنی هیچ‌کس نمی‌فهمتت.", likes: 3100 },
    { id: 4, name: "رضا", username: "reza_gh", text: "شب‌های تنهایی بلندترین شب‌های عمرمن.", likes: 890 },
  ]},
  { id: 3, title: "خاطرات کودکی", emoji: "🌿", count: "۵ هزار پست", posts: [
    { id: 5, name: "مریم", username: "maryam_r", text: "بوی خاک بعد از بارون هنوزم منو می‌بره به حیاط خونه بچگیم.", likes: 4200 },
    { id: 6, name: "کیان", username: "kian_t", text: "کاش می‌شد یه روز برگشت به اون بی‌خیالی‌های بچگی.", likes: 2700 },
  ]},
  { id: 4, title: "مهاجرت", emoji: "✈️", count: "۶ هزار پست", posts: [
    { id: 7, name: "علی", username: "ali_k", text: "مهاجرت یعنی هر روز صبح با دو تا زبان بیدار شی.", likes: 1600 },
    { id: 8, name: "سارا", username: "sara_m", text: "وقتی رفتم فکر می‌کردم برمی‌گردم. حالا نمی‌دونم کجا خونمه.", likes: 5300 },
  ]},
  { id: 5, title: "موفقیت و شکست", emoji: "🔥", count: "۹ هزار پست", posts: [
    { id: 9, name: "رضا", username: "reza_gh", text: "شکست یعنی یه قدم جلوتر از کسی که اصلاً امتحان نکرد.", likes: 6100 },
    { id: 10, name: "نیلوفر", username: "nilofar", text: "موفقیت یه‌شبه نیست. یه‌شبه فقط ورشکستگیه.", likes: 3400 },
  ]},
  { id: 6, title: "داستان‌های نیمه‌شب", emoji: "🕯️", count: "۴ هزار پست", posts: [
    { id: 11, name: "کیان", username: "kian_t", text: "نیمه شب‌ها یه جور دیگه فکر می‌کنم. انگار صادق‌ترم.", likes: 2200 },
    { id: 12, name: "مریم", username: "maryam_r", text: "ساعت ۳ شب وقتیه که آدم با خودش رو در رو میشه.", likes: 4800 },
  ]},
  { id: 7, title: "خانواده", emoji: "🏠", count: "۷ هزار پست", posts: [
    { id: 13, name: "سارا", username: "sara_m", text: "مامانم هیچ‌وقت نگفت دوستت دارم. ولی هر بار که می‌رفتم در رو نگاه می‌کرد تا برسم.", likes: 7200 },
    { id: 14, name: "رضا", username: "reza_gh", text: "بابام کم حرف بود. ولی حرف‌هاش سنگین بود.", likes: 3900 },
  ]},
  { id: 8, title: "امید و انگیزه", emoji: "☀️", count: "۱۰ هزار پست", posts: [
    { id: 15, name: "نیلوفر", username: "nilofar", text: "فردا همیشه یه شانس دیگه‌ست.", likes: 5500 },
    { id: 16, name: "علی", username: "ali_k", text: "هر روز که بیدار میشی، یه فرصته. ازش استفاده کن.", likes: 2100 },
  ]},
];

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " هزار";
  return n.toString();
}

export default function DiscoverPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const active = CATEGORIES.find((c) => c.id === activeCategory);

  if (active) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">
        <div className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-[#111] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveCategory(null)} className="text-[#e8e6e0]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div dir="rtl">
            <h1 className="text-base font-medium">{active.emoji} {active.title}</h1>
            <p className="text-xs text-[#555]">{active.count}</p>
          </div>
        </div>

        <div className="flex-1 pb-24">
          {active.posts.map((post) => (
            <div key={post.id} className="flex gap-3 px-4 py-4 border-b border-[#111]">
              <button onClick={() => router.push(`/user/${post.username}`)}
                className="w-10 h-10 rounded-full bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center text-[#666] font-medium hover:opacity-80 transition-opacity">
                {post.name.charAt(0)}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1" dir="rtl">
                  <button onClick={() => router.push(`/user/${post.username}`)}
                    className="text-sm font-medium text-[#e8e6e0] hover:underline">{post.name}</button>
                  <span className="text-sm text-[#555]">@{post.username}</span>
                </div>
                <p className="text-sm text-[#ccc] leading-7 mb-2" dir="rtl">{post.text}</p>
                <div className="flex items-center gap-1.5 text-[#555]">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span className="text-xs">{formatNumber(post.likes)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
          {["/feed", "/search", "/feed", "/notifications", "/messages"].map((path, i) => (
            <button key={i} onClick={() => router.push(path)}
              className="flex-1 flex justify-center items-center py-3 text-[#444] hover:text-[#888] transition-colors">
              {[
                <svg key="h" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round"/></svg>,
                <svg key="s" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                <svg key="r" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg>,
                <svg key="n" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>,
                <svg key="m" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg>,
              ][i]}
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">
      <div className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-[#111] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[#e8e6e0]">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="text-base font-medium" dir="rtl">کشف کن</h1>
      </div>

      <div className="px-4 pt-2 pb-24">
        <p className="text-sm text-[#555] text-right my-3" dir="rtl">یه دسته‌بندی انتخاب کن و داستان‌های مشابه رو کشف کن</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 text-right hover:border-[#333] hover:bg-[#141414] transition-all">
              <div className="text-2xl mb-2">{cat.emoji}</div>
              <p className="text-sm font-medium text-[#e8e6e0] mb-1" dir="rtl">{cat.title}</p>
              <p className="text-xs text-[#444]" dir="rtl">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
        {["/feed", "/search", "/feed", "/notifications", "/messages"].map((path, i) => (
          <button key={i} onClick={() => router.push(path)}
            className="flex-1 flex justify-center items-center py-3 text-[#444] hover:text-[#888] transition-colors">
            {[
              <svg key="h" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round"/></svg>,
              <svg key="s" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
              <svg key="r" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg>,
              <svg key="n" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>,
              <svg key="m" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg>,
            ][i]}
          </button>
        ))}
      </div>
    </main>
  );
}