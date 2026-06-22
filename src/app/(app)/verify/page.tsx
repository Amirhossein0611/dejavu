"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const isEmail = contact.includes("@");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleVerify() {
    if (code === "123456") {
      router.push(`/setup?contact=${encodeURIComponent(contact)}`);
    } else {
      setError("کد وارد شده اشتباه است. دوباره امتحان کن.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 px-6">

        <svg width="80" height="100" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="0" width="4" height="8" fill="#cc2222"/>
          <rect x="36" y="122" width="4" height="8" fill="#cc2222"/>
          <line x1="38" y1="0" x2="38" y2="130" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="2" y1="18" x2="88" y2="18" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="88" y1="18" x2="54" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="54" y1="100" x2="38" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
        </svg>

        <div className="text-center" dir="rtl">
          <p className="text-xl font-bold text-[#e8e6e0] mb-2">کد فعالسازی</p>
          <p className="text-sm text-[#555] leading-7">
            {isEmail
              ? `لطفاً کد ارسالی به ایمیل ${contact} را وارد کنید`
              : `لطفاً کد ارسالی به شماره ${contact} را وارد کنید`}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="کد ۶ رقمی"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            className="w-full px-4 py-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm placeholder-[#333] outline-none focus:border-[#444] text-center tracking-[0.4em] text-lg"
          />
          {error && <p className="text-xs text-red-500 text-center" dir="rtl">{error}</p>}
          <button onClick={handleVerify} className="w-full py-3 bg-[#e8e6e0] text-[#0a0a0a] font-semibold rounded-lg text-sm hover:opacity-85 transition-opacity">
            تأیید
          </button>
        </div>

        <button onClick={() => router.back()} className="text-xs text-[#444] hover:text-[#888] transition-colors" dir="rtl">
          بازگشت
        </button>

      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <VerifyContent />
    </Suspense>
  );
}