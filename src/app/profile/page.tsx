"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const MY_POSTS = [
  { id: 1, text: "گاهی فکر می‌کنم بزرگ‌ترین شجاعت آدم اینه که وقتی همه چیز خوبه، بذاره برگرده به اون لحظه‌ای که همه چیز خراب بود.", likes: 120, comments: 8, time: "۲ ساعت پیش" },
  { id: 2, text: "امروز فهمیدم که بعضی آدم‌ها فقط برای یه فصل از زندگیت میان. نه بیشتر، نه کمتر.", likes: 340, comments: 24, time: "دیروز" },
  { id: 3, text: "سکوت گاهی بلندترین جوابیه که میشه داد.", likes: 891, comments: 67, time: "۳ روز پیش" },
];

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " هزار";
  return n.toString();
}

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [tab, setTab] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = localStorage.getItem("dj_username") || "";
    const a = localStorage.getItem("dj_avatar") || "";
    const b = localStorage.getItem("dj_bio") || "";
    setUsername(u); setAvatar(a); setBio(b);
    setEditUsername(u); setEditBio(b); setEditAvatar(a);
  }, []);

  function saveProfile() {
    localStorage.setItem("dj_username", editUsername);
    localStorage.setItem("dj_avatar", editAvatar);
    localStorage.setItem("dj_bio", editBio);
    setUsername(editUsername);
    setAvatar(editAvatar);
    setBio(editBio);
    setEditing(false);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">

      {/* هدر */}
      <div className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-[#111] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[#e8e6e0]">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="text-base font-medium" dir="rtl">پروفایل من</h1>
      </div>

      {/* بخش اطلاعات */}
      <div className="px-4 pt-5 pb-4 border-b border-[#111]">
        <div className="flex items-start justify-between mb-4">

          {/* آواتار */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] overflow-hidden flex items-center justify-center text-2xl text-[#555] font-medium">
              {(editing ? editAvatar : avatar)
                ? <img src={editing ? editAvatar : avatar} alt="avatar" className="w-full h-full object-cover" />
                : <span>{username.charAt(0).toUpperCase() || "؟"}</span>
              }
            </div>
            {editing && (
              <button onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#e8e6e0] rounded-full flex items-center justify-center text-[#0a0a0a]">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          {/* دکمه ویرایش */}
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="px-4 py-1.5 border border-[#2a2a2a] rounded-full text-sm text-[#e8e6e0] hover:border-[#444] transition-colors">
              ویرایش پروفایل
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)}
                className="px-4 py-1.5 border border-[#2a2a2a] rounded-full text-sm text-[#888] hover:border-[#444] transition-colors">
                انصراف
              </button>
              <button onClick={saveProfile}
                className="px-4 py-1.5 bg-[#e8e6e0] rounded-full text-sm text-[#0a0a0a] font-semibold hover:opacity-85 transition-opacity">
                ذخیره
              </button>
            </div>
          )}
        </div>

        {/* اطلاعات کاربر */}
        {!editing ? (
          <div dir="rtl">
            <p className="text-base font-semibold text-[#e8e6e0]">{username || "کاربر"}</p>
            <p className="text-sm text-[#555] mb-2">@{username || "username"}</p>
            {bio && <p className="text-sm text-[#aaa] leading-6">{bio}</p>}
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-[#555]"><span className="text-[#e8e6e0] font-medium">۱۲۴</span> دنبال‌شده</span>
              <span className="text-sm text-[#555]"><span className="text-[#e8e6e0] font-medium">۸۷</span> دنبال‌کننده</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3" dir="rtl">
            <div>
              <label className="text-xs text-[#555] mb-1 block">یوزرنیم</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-sm">@</span>
                <input type="text" value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value.toLowerCase())}
                  className="w-full pl-8 pr-4 py-2.5 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm outline-none focus:border-[#444] text-left"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#555] mb-1 block">بیو</label>
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)}
                placeholder="درباره خودت بنویس..."
                rows={3}
                className="w-full px-4 py-2.5 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm outline-none focus:border-[#444] resize-none text-right placeholder-[#333]"
              />
            </div>
          </div>
        )}
      </div>

      {/* تب‌های پست */}
      <div className="flex border-b border-[#111]">
        {["پست‌ها", "لایک‌ها"].map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-3 text-sm relative transition-colors ${tab === i ? "text-[#e8e6e0] font-medium" : "text-[#555]"}`}>
            {t}
            {tab === i && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#e8e6e0] rounded-full" />}
          </button>
        ))}
      </div>

      {/* پست‌ها */}
      <div className="flex-1 pb-24">
        {tab === 0 ? MY_POSTS.map((post) => (
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
        )) : (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-[#444]">
            <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p className="text-sm" dir="rtl">هنوز پستی لایک نکردی</p>
          </div>
        )}
      </div>

      {/* نوار پایین */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
        {[
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round"/></svg>, path: "/feed" },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, path: "/search" },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg>, path: "/feed" },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>, path: "/notifications" },
          { icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg>, path: "/messages" },
        ].map((item, i) => (
          <button key={i} onClick={() => router.push(item.path)}
            className="flex-1 flex justify-center items-center py-3 text-[#444] hover:text-[#888] transition-colors">
            {item.icon}
          </button>
        ))}
      </div>

    </main>
  );
}