"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const USERS: Record<string, { name: string; bio: string; followers: number; following: number; posts: { id: number; text: string; likes: number; comments: number; time: string; }[] }> = {
  sara_m: {
    name: "سارا محمدی", bio: "نویسنده | عاشق قهوه و کتاب | داستان‌های روزمره زندگی",
    followers: 1240, following: 380,
    posts: [
      { id: 1, text: "گاهی فکر می‌کنم بزرگ‌ترین شجاعت آدم اینه که وقتی همه چیز خوبه، بذاره برگرده.", likes: 1200, comments: 84, time: "۲ ساعت پیش" },
      { id: 2, text: "عشق یعنی وقتی می‌دونی طرف مقابلت کامل نیست، ولی برات کامله.", likes: 2400, comments: 156, time: "دیروز" },
    ],
  },
  ali_k: {
    name: "علی کریمی", bio: "مهاجر | داستان‌نویس | تهران → وین",
    followers: 873, following: 210,
    posts: [
      { id: 1, text: "شب اول مهاجرت. آپارتمان خالی. یه چمدون.", likes: 873, comments: 120, time: "۵ ساعت پیش" },
      { id: 2, text: "مهاجرت یعنی هر روز صبح با دو تا زبان بیدار شی.", likes: 1600, comments: 98, time: "۲ روز پیش" },
    ],
  },
  nilofar: {
    name: "نیلوفر رضایی", bio: "شعر می‌نویسم وقتی دلم می‌گیره",
    followers: 3400, following: 120,
    posts: [
      { id: 1, text: "مامانم همیشه می‌گفت گریه کردن ضعفه. حالا که بزرگ شدم فهمیدم اون خودش همیشه تو حموم گریه می‌کرد.", likes: 3400, comments: 247, time: "دیروز" },
      { id: 2, text: "بعضی آدم‌ها مثل پاییزن. زیبان ولی موندگار نیستن.", likes: 1800, comments: 134, time: "۳ روز پیش" },
    ],
  },
  reza_gh: {
    name: "رضا غفاری", bio: "نویسنده کتاب «باران بی‌موقع» | قهوه‌خور حرفه‌ای",
    followers: 5100, following: 450,
    posts: [
      { id: 1, text: "استادم گفت: «تو هیچ‌وقت نویسنده نمی‌شی.» امروز کتابم رو توی ویترین کتاب‌فروشی دیدم.", likes: 5100, comments: 389, time: "۲ روز پیش" },
      { id: 2, text: "شکست یعنی یه قدم جلوتر از کسی که اصلاً امتحان نکرد.", likes: 6100, comments: 421, time: "هفته پیش" },
    ],
  },
  maryam_r: {
    name: "مریم نوری", bio: "روان‌شناس | مادر | داستان‌پرداز",
    followers: 920, following: 310,
    posts: [
      { id: 1, text: "بوی خاک بعد از بارون هنوزم منو می‌بره به حیاط خونه بچگیم.", likes: 4200, comments: 278, time: "۴ روز پیش" },
    ],
  },
  kian_t: {
    name: "کیان تهرانی", bio: "موسیقی‌دان و نویسنده",
    followers: 2100, following: 560,
    posts: [
      { id: 1, text: "نیمه شب‌ها یه جور دیگه فکر می‌کنم. انگار صادق‌ترم.", likes: 2200, comments: 189, time: "۵ روز پیش" },
    ],
  },
};

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " هزار";
  return n.toString();
}

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const user = USERS[username];
  const [followed, setFollowed] = useState(false);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <p className="text-lg font-medium mb-2">کاربر پیدا نشد</p>
          <button onClick={() => router.back()} className="text-sm text-[#555] hover:text-[#e8e6e0]">بازگشت</button>
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
        <h1 className="text-base font-medium" dir="rtl">{user.name}</h1>
      </div>

      {/* پروفایل */}
      <div className="px-4 pt-5 pb-4 border-b border-[#111]">
        <div className="flex items-start justify-between mb-4">
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center text-2xl text-[#555] font-medium">
            {user.name.charAt(0)}
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push("/messages")}
              className="px-4 py-1.5 border border-[#2a2a2a] rounded-full text-sm text-[#e8e6e0] hover:border-[#444] transition-colors">
              پیام
            </button>
            <button onClick={() => setFollowed(!followed)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                followed ? "border border-[#444] text-[#888]" : "bg-[#e8e6e0] text-[#0a0a0a]"
              }`}>
              {followed ? "دنبال‌شده" : "دنبال کن"}
            </button>
          </div>
        </div>

        <div dir="rtl">
          <p className="text-base font-semibold">{user.name}</p>
          <p className="text-sm text-[#555] mb-2">@{username}</p>
          <p className="text-sm text-[#aaa] leading-6 mb-3">{user.bio}</p>
          <div className="flex gap-4">
            <span className="text-sm text-[#555]"><span className="text-[#e8e6e0] font-medium">{formatNumber(user.following)}</span> دنبال‌شده</span>
            <span className="text-sm text-[#555]"><span className="text-[#e8e6e0] font-medium">{formatNumber(user.followers)}</span> دنبال‌کننده</span>
          </div>
        </div>
      </div>

      {/* پست‌ها */}
      <div className="flex-1 pb-24">
        <div className="border-b border-[#111] py-2.5 px-4">
          <p className="text-sm font-medium text-right" dir="rtl">پست‌ها</p>
        </div>
        {user.posts.map((post) => (
          <div key={post.id} className="px-4 py-4 border-b border-[#111]">
            <p className="text-sm text-[#ccc] leading-7 mb-3" dir="rtl">{post.text}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <span className="text-xs text-[#555] flex items-center gap-1">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {formatNumber(post.likes)}
                </span>
                <span className="text-xs text-[#555] flex items-center gap-1">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {formatNumber(post.comments)}
                </span>
              </div>
              <span className="text-xs text-[#444]">{post.time}</span>
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