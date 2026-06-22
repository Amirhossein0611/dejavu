"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ComposePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 500;

  useEffect(() => {
    setUsername(localStorage.getItem("dj_username") || "");
    setAvatar(localStorage.getItem("dj_avatar") || "");
    textareaRef.current?.focus();
  }, []);

  function handleMedia(e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia((prev) => [...prev, { url: reader.result as string, type }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removeMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePost() {
    if (!text.trim() && media.length === 0) return;
    setLoading(true);

    try {
      const userId = localStorage.getItem("dj_user_id");
      const name = username || "کاربر";

      const { error } = await supabase.from("posts").insert({
        user_id: userId || null,
        username: username || "user",
        name,
        content: text.trim(),
        media_urls: media.map((m) => m.url),
      });

      if (error) {
        console.error("خطا در ذخیره پست:", error);
      }

      router.push("/feed");
    } catch (err) {
      console.error(err);
      router.push("/feed");
    } finally {
      setLoading(false);
    }
  }

  const remaining = MAX_CHARS - text.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 50 && remaining >= 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto">

      {/* هدر */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-[#0a0a0a] z-10 border-b border-[#111]">
        <button
          onClick={() => router.back()}
          className="text-sm text-[#e8e6e0] hover:text-[#aaa] transition-colors"
        >
          انصراف
        </button>

        <button
          onClick={handlePost}
          disabled={(!text.trim() && media.length === 0) || isOverLimit || loading}
          className="px-5 py-2 bg-[#e8e6e0] text-[#0a0a0a] font-semibold text-sm rounded-full disabled:opacity-30 hover:opacity-85 transition-opacity"
        >
          {loading ? "در حال انتشار..." : "انتشار"}
        </button>
      </div>

      {/* بدنه */}
      <div className="flex gap-3 px-4 pt-4 flex-1">

        <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex-shrink-0 overflow-hidden flex items-center justify-center text-[#555] font-medium text-base">
          {avatar
            ? <img src={avatar} alt="me" className="w-full h-full object-cover" />
            : <span>{username.charAt(0).toUpperCase() || "؟"}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="داستانت رو بگو..."
            dir="rtl"
            rows={6}
            className="w-full bg-transparent border-none outline-none resize-none text-[#e8e6e0] text-base leading-7 placeholder-[#333] text-right"
          />

          {media.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2 mb-3">
              {media.map((item, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#2a2a2a]">
                  {item.type === "image"
                    ? <img src={item.url} alt="" className="w-full h-full object-cover" />
                    : <video src={item.url} className="w-full h-full object-cover" muted />
                  }
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0a0a0a] bg-opacity-80 rounded-full flex items-center justify-center text-xs text-[#e8e6e0]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* بخش پایین */}
      <div className="sticky bottom-0 bg-[#0a0a0a]">

        <div className="flex items-center justify-between px-4 py-2 border-t border-[#141414]">
          <button className="flex items-center gap-2 text-sm text-[#e8e6e0]">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            همه می‌تونن ببینن
          </button>

          <div className="flex items-center gap-4">
            {(isNearLimit || isOverLimit) && (
              <span className={`text-xs font-medium ${isOverLimit ? "text-red-500" : "text-[#888]"}`}>
                {remaining}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center px-4 py-3 border-t border-[#141414]">
          <button onClick={() => fileRef.current?.click()} className="flex-1 flex justify-center text-[#e8e6e0] hover:text-[#aaa] transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleMedia(e, "image")} className="hidden" />

          <button onClick={() => videoRef.current?.click()} className="flex-1 flex justify-center text-[#e8e6e0] hover:text-[#aaa] transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </button>
          <input ref={videoRef} type="file" accept="video/*" onChange={(e) => handleMedia(e, "video")} className="hidden" />

          <button className="flex-1 flex justify-center text-[#e8e6e0] hover:text-[#aaa] transition-colors text-xs font-bold tracking-tight">
            GIF
          </button>

          <div className="w-px h-6 bg-[#1e1e1e] mx-2" />

          <button className="w-8 h-8 border border-[#e8e6e0] rounded-full flex items-center justify-center text-[#e8e6e0] hover:opacity-70 transition-opacity">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

    </main>
  );
}