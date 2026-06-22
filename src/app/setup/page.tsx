"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const JALALI_MONTHS = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند"
];

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!username.trim()) { setError("یوزرنیم را وارد کن"); return; }
    if (username.includes(" ")) { setError("یوزرنیم نباید فاصله داشته باشه"); return; }
    if (!day || !month || !year) { setError("تاریخ تولد را کامل وارد کن"); return; }
    if (year.length !== 4) { setError("سال تولد باید ۴ رقم باشه"); return; }

    setLoading(true);
    setError("");

    try {
      // چک کردن یوزرنیم تکراری
      const { data: existing } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existing) {
        setError("این یوزرنیم قبلاً گرفته شده، یکی دیگه انتخاب کن");
        setLoading(false);
        return;
      }

      // ذخیره کاربر توی Supabase
      const isEmail = contact.includes("@");
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          username,
          email: isEmail ? contact : null,
          phone: !isEmail ? contact : null,
          avatar_url: avatar || "",
          birthday: `${year}/${month}/${day}`,
          bio: "",
        })
        .select()
        .single();

      if (insertError) {
        setError("مشکلی پیش اومد، دوباره امتحان کن");
        setLoading(false);
        return;
      }

      // ذخیره توی localStorage
      localStorage.setItem("dj_username", username);
      localStorage.setItem("dj_avatar", avatar || "");
      localStorage.setItem("dj_birthday", `${year}/${month}/${day}`);
      localStorage.setItem("dj_contact", contact);
      localStorage.setItem("dj_user_id", newUser.id);

      router.push("/welcome");

    } catch (err) {
      setError("مشکلی پیش اومد، دوباره امتحان کن");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-7 px-6 py-12">

        <svg width="60" height="75" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="0" width="4" height="8" fill="#cc2222"/>
          <rect x="36" y="122" width="4" height="8" fill="#cc2222"/>
          <line x1="38" y1="0" x2="38" y2="130" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="2" y1="18" x2="88" y2="18" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="88" y1="18" x2="54" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="54" y1="100" x2="38" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
        </svg>

        <div className="text-center" dir="rtl">
          <p className="text-xl font-bold text-[#e8e6e0] mb-1">پروفایلت رو بساز</p>
          <p className="text-sm text-[#555]">یه قدم مونده تا وارد دژاوو بشی</p>
        </div>

        {/* آپلود عکس پروفایل */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-full border border-[#2a2a2a] flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#444] transition-colors bg-[#111]"
          >
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl text-[#333]">+</span>
                <span className="text-[10px] text-[#333]">عکس</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          <p className="text-xs text-[#444]" dir="rtl">عکس پروفایل (اختیاری)</p>
        </div>

        {/* یوزرنیم */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs text-[#555] text-right" dir="rtl">یوزرنیم</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-sm">@</span>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value.toLowerCase()); setError(""); }}
              className="w-full pl-8 pr-4 py-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm placeholder-[#333] outline-none focus:border-[#444] text-left tracking-wide"
              dir="ltr"
            />
          </div>
        </div>

        {/* تاریخ تولد شمسی */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs text-[#555] text-right" dir="rtl">تاریخ تولد (شمسی)</label>
          <div className="flex gap-2" dir="rtl">
            <input
              type="number"
              placeholder="روز"
              value={day}
              min={1} max={31}
              onChange={(e) => setDay(e.target.value)}
              className="w-1/4 px-3 py-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm placeholder-[#333] outline-none focus:border-[#444] text-center"
            />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex-1 px-3 py-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg text-sm outline-none focus:border-[#444] text-center"
              style={{ color: month ? "#e8e6e0" : "#333" }}
            >
              <option value="" disabled>ماه</option>
              {JALALI_MONTHS.map((m, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")} style={{ background: "#111" }}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="سال"
              value={year}
              min={1300} max={1420}
              onChange={(e) => setYear(e.target.value)}
              className="w-1/4 px-3 py-3 bg-transparent border border-[#1e1e1e] rounded-lg text-[#e8e6e0] text-sm placeholder-[#333] outline-none focus:border-[#444] text-center"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center" dir="rtl">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-[#e8e6e0] text-[#0a0a0a] font-semibold rounded-lg text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {loading ? "در حال ثبت..." : "ادامه"}
        </button>

      </div>
    </main>
  );
}