"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("dj_username") || "کاربر");
    setAvatar(localStorage.getItem("dj_avatar") || "");
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 px-6 text-center">

        <svg width="60" height="75" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="0" width="4" height="8" fill="#cc2222"/>
          <rect x="36" y="122" width="4" height="8" fill="#cc2222"/>
          <line x1="38" y1="0" x2="38" y2="130" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="2" y1="18" x2="88" y2="18" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="88" y1="18" x2="54" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="54" y1="100" x2="38" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
        </svg>

        {/* عکس پروفایل گرد */}
        <div className="w-28 h-28 rounded-full border-2 border-[#2a2a2a] overflow-hidden bg-[#111] flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-[#555]">
              {username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* یوزرنیم */}
        <div dir="rtl">
          <p className="text-[#555] text-sm mb-1">خوش اومدی به دژاوو</p>
          <p className="text-2xl font-bold text-[#e8e6e0]">@{username}</p>
        </div>

        {/* متن */}
        <p className="text-sm text-[#444] max-w-xs leading-7" dir="rtl">
          جایی که داستانت زندگی می‌کنه. اینجا می‌تونی روایت کنی، بشنوی و با آدم‌هایی که درکت می‌کنن ارتباط بگیری.
        </p>

        {/* دکمه */}
        <button
          onClick={() => router.push("/feed")}
          className="px-10 py-3 bg-[#e8e6e0] text-[#0a0a0a] font-semibold rounded-lg text-sm hover:opacity-85 transition-opacity"
          dir="rtl"
        >
          وارد دنیای دژاوو بشو
        </button>

      </div>
    </main>
  );
}