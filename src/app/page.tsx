"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  function handleContinue() {
    if (!contact.trim()) {
      setError("لطفاً ایمیل یا شماره موبایل را وارد کنید");
      return;
    }
    setError("");
    router.push(`/verify?contact=${encodeURIComponent(contact)}`);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex">

      {/* سمت چپ — لوگو و متن */}
      <div className="flex-1 flex flex-col items-center justify-center px-16 gap-10">

        {/* لوگو */}
        <svg width="180" height="220" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="0" width="4" height="8" fill="#cc2222"/>
          <rect x="36" y="122" width="4" height="8" fill="#cc2222"/>
          <line x1="38" y1="0" x2="38" y2="130" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="2" y1="18" x2="88" y2="18" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="88" y1="18" x2="54" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="54" y1="100" x2="38" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
        </svg>

        {/* متن */}
        <div className="text-center">
          <p className="text-[10px] font-medium tracking-[0.25em] text-[#444] uppercase mb-3">
            A new social experience
          </p>
          <h1 className="font-serif text-lg font-normal leading-relaxed text-[#e8e6e0]">
            Somewhere you belong.
          </h1>
        </div>

      </div>

      {/* خط جداکننده */}
      <div className="w-px bg-[#141414]" />

      {/* سمت راست — فرم */}
      <div className="flex-1 flex flex-col justify-center px-16">

        <h2 className="text-xl font-medium text-right text-[#e8e6e0] mb-1">
          ورود به دژاوو
        </h2>
        <p className="text-sm text-[#444] text-right mb-8" dir="rtl">
          اولین بار اینجایی؟ حساب بساز و داستانت رو بگو
        </p>

        <input
          type="text"
          placeholder="ایمیل یا شماره موبایل"
          dir="rtl"
          value={contact}
          onChange={(e) => { setContact(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          className="w-full px-4 py-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm placeholder-[#333] outline-none focus:border-[#444] text-right mb-3"
        />

        {error && (
          <p className="text-xs text-red-500 text-right mb-2" dir="rtl">{error}</p>
        )}

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-[#e8e6e0] text-[#0a0a0a] font-semibold rounded-lg text-sm mb-3 hover:opacity-85 transition-opacity"
        >
          ادامه
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="text-xs text-[#333]">یا</span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
        </div>

        <button className="w-full py-3 border border-[#1e1e1e] rounded-lg text-[#888] text-sm flex items-center justify-center gap-2 mt-3 hover:border-[#333] transition-colors">
          ورود با گوگل
        </button>

        <p className="text-[11px] text-[#333] text-right mt-4 leading-7" dir="rtl">
          با ادامه، <span className="underline text-[#555] cursor-pointer">شرایط استفاده</span> و{" "}
          <span className="underline text-[#555] cursor-pointer">سیاست حریم خصوصی</span> دژاوو را می‌پذیری.
        </p>

        <p className="text-sm text-[#444] text-right mt-5" dir="rtl">
          حساب نداری؟{" "}
          <span
            onClick={handleContinue}
            className="text-[#e8e6e0] font-medium cursor-pointer"
          >
            همین الان بساز
          </span>
        </p>

      </div>

    </main>
  );
}