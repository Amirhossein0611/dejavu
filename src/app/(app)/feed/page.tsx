"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Comment = { id: string; name: string; username: string; text: string; time: string; };
type Post = {
  id: string; name: string; username: string; time: string; text: string;
  likes: number; comments: number; reposts: number;
  liked: boolean; reposted: boolean;
  commentList: Comment[];
  showComments: boolean;
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "همین الان";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  return `${Math.floor(diff / 86400)} روز پیش`;
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " هزار";
  return n.toString();
}

export default function FeedPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [id: string]: string }>({});
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("dj_username") || "");
    setAvatar(localStorage.getItem("dj_avatar") || "");
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) { setLoading(false); return; }

    const mapped: Post[] = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      username: p.username,
      time: timeAgo(p.created_at),
      text: p.content,
      likes: p.likes_count,
      comments: p.comments_count,
      reposts: p.reposts_count,
      liked: false,
      reposted: false,
      commentList: [],
      showComments: false,
    }));

    setPosts(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function toggleLike(id: string) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const newLiked = !post.liked;
    const newLikes = newLiked ? post.likes + 1 : post.likes - 1;

    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: newLiked, likes: newLikes } : p));

    await supabase.from("posts").update({ likes_count: newLikes }).eq("id", id);
  }

  async function toggleRepost(id: string) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const newReposted = !post.reposted;
    const newReposts = newReposted ? post.reposts + 1 : post.reposts - 1;

    setPosts(prev => prev.map(p => p.id === id ? { ...p, reposted: newReposted, reposts: newReposts } : p));

    await supabase.from("posts").update({ reposts_count: newReposts }).eq("id", id);
  }

  function toggleComments(id: string) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, showComments: !p.showComments } : p));
  }

  async function submitComment(id: string) {
    const text = commentText[id]?.trim();
    if (!text) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: username || "من",
      username: username || "me",
      text,
      time: "همین الان",
    };

    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, commentList: [...p.commentList, newComment], comments: p.comments + 1 } : p
    ));

    setCommentText(prev => ({ ...prev, [id]: "" }));

    await supabase.from("comments").insert({
      post_id: id,
      username: username || "me",
      name: username || "من",
      content: text,
    });

    await supabase.from("posts").update({ comments_count: (posts.find(p => p.id === id)?.comments || 0) + 1 }).eq("id", id);
  }

  const navItems = [
    { label: "خانه", path: "/feed", icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: "جستجو", path: "/search", icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { label: "رفرش", path: null, icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round"/></svg> },
    { label: "اعلان", path: "/notifications", icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg> },
    { label: "پیام", path: "/messages", icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg> },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e6e0] flex flex-col max-w-[600px] mx-auto relative">

      <div className="flex items-center justify-between px-4 pt-4 pb-0 sticky top-0 bg-[#0a0a0a] z-10">
        <button onClick={() => router.push("/profile")} className="w-8 h-8 rounded-full bg-[#1e1e1e] overflow-hidden flex items-center justify-center text-sm text-[#555]">
          {avatar ? <img src={avatar} alt="me" className="w-full h-full object-cover" /> : <span>{username.charAt(0).toUpperCase() || "؟"}</span>}
        </button>
        <svg width="32" height="40" viewBox="0 0 110 140" fill="none">
          <rect x="36" y="0" width="4" height="8" fill="#cc2222"/>
          <rect x="36" y="122" width="4" height="8" fill="#cc2222"/>
          <line x1="38" y1="0" x2="38" y2="130" stroke="#e8e6e0" strokeWidth="2"/>
          <line x1="2" y1="18" x2="88" y2="18" stroke="#e8e6e0" strokeWidth="2"/>
          <line x1="88" y1="18" x2="54" y2="100" stroke="#e8e6e0" strokeWidth="2"/>
          <line x1="54" y1="100" x2="38" y2="100" stroke="#e8e6e0" strokeWidth="2"/>
        </svg>
        <button onClick={() => router.push("/explore-users")} className="w-8 h-8 flex items-center justify-center text-[#e8e6e0]">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </button>
      </div>

      <div className="flex border-b border-[#1a1a1a] mt-3 sticky top-[52px] bg-[#0a0a0a] z-10">
        {["برای تو", "دنبال‌شده‌ها", "کشف کن"].map((t, i) => (
          <button key={i} onClick={() => { setTab(i); if (i === 2) router.push("/discover"); }}
            className={`flex-1 py-3 text-sm relative transition-colors ${tab === i ? "text-[#e8e6e0] font-medium" : "text-[#555]"}`}>
            {t}
            {tab === i && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#e8e6e0] rounded-full" />}
            {i === 2 && <span className="absolute top-2 right-6 w-2 h-2 bg-[#cc2222] rounded-full" />}
          </button>
        ))}
      </div>

      <div className="flex-1 pb-24">
        {loading ? (
          <div className="flex items-center justify-center pt-20">
            <div className="text-[#444] text-sm" dir="rtl">در حال بارگذاری...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-[#444]">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="text-sm" dir="rtl">هنوز پستی نیست — اولین داستانت رو بنویس!</p>
          </div>
        ) : posts.map((post) => (
          <div key={post.id} className="border-b border-[#111]">
            <div className="flex gap-3 px-4 py-4">
              <button onClick={() => router.push(`/user/${post.username}`)}
                className="w-10 h-10 rounded-full bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center text-[#666] font-medium text-base hover:opacity-80 transition-opacity">
                {post.name.charAt(0)}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap" dir="rtl">
                    <button onClick={() => router.push(`/user/${post.username}`)} className="text-sm font-medium text-[#e8e6e0] hover:underline">{post.name}</button>
                    <span className="text-sm text-[#555]">@{post.username}</span>
                    <span className="text-xs text-[#444]">· {post.time}</span>
                    {post.reposted && <span className="text-xs text-[#555]">· ریپوست شد</span>}
                  </div>
                  <div className="relative" ref={menuOpen === post.id ? menuRef : null}>
                    <button onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                      className="text-[#444] hover:text-[#e8e6e0] text-lg leading-none px-1 transition-colors">···</button>
                    {menuOpen === post.id && (
                      <div className="absolute left-0 top-6 bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden z-30 w-40 shadow-xl">
                        <button onClick={() => setMenuOpen(null)} className="w-full px-4 py-3 text-sm text-right text-[#e8e6e0] hover:bg-[#1a1a1a] transition-colors block" dir="rtl">دنبال کردن</button>
                        <button onClick={() => setMenuOpen(null)} className="w-full px-4 py-3 text-sm text-right text-[#e8e6e0] hover:bg-[#1a1a1a] transition-colors block" dir="rtl">ریپورت</button>
                        <button onClick={() => setMenuOpen(null)} className="w-full px-4 py-3 text-sm text-right text-red-500 hover:bg-[#1a1a1a] transition-colors block" dir="rtl">بلاک</button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#ccc] leading-7 mb-3" dir="rtl">{post.text}</p>

                <div className="flex gap-5">
                  <button onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? "text-[#cc2222]" : "text-[#555] hover:text-[#e8e6e0]"}`}>
                    <svg width="17" height="17" fill={post.liked ? "#cc2222" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {formatNumber(post.likes)}
                  </button>
                  <button onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.showComments ? "text-[#e8e6e0]" : "text-[#555] hover:text-[#e8e6e0]"}`}>
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {formatNumber(post.comments)}
                  </button>
                  <button onClick={() => toggleRepost(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.reposted ? "text-green-500" : "text-[#555] hover:text-[#e8e6e0]"}`}>
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polyline points="17 1 21 5 17 9"/>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                      <polyline points="7 23 3 19 7 15"/>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                    </svg>
                    {formatNumber(post.reposts)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-[#555] hover:text-[#e8e6e0] transition-colors">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {post.showComments && (
              <div className="px-4 pb-4 border-t border-[#111]">
                {post.commentList.map((c) => (
                  <div key={c.id} className="flex gap-2 mt-3">
                    <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center text-xs text-[#666]">{c.name.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5" dir="rtl">
                        <span className="text-xs font-medium text-[#e8e6e0]">{c.name}</span>
                        <span className="text-xs text-[#444]">@{c.username}</span>
                        <span className="text-xs text-[#333]">· {c.time}</span>
                      </div>
                      <p className="text-xs text-[#aaa] leading-6" dir="rtl">{c.text}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex-shrink-0 flex items-center justify-center text-xs text-[#555]">
                    {avatar ? <img src={avatar} alt="me" className="w-full h-full object-cover rounded-full" /> : <span>{username.charAt(0).toUpperCase() || "؟"}</span>}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input type="text" placeholder="کامنت بنویس..." dir="rtl"
                      value={commentText[post.id] || ""}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                      className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-[#e8e6e0] placeholder-[#333] outline-none focus:border-[#444] text-right"
                    />
                    <button onClick={() => submitComment(post.id)} className="px-3 py-1.5 bg-[#e8e6e0] text-[#0a0a0a] text-xs font-semibold rounded-lg hover:opacity-85 transition-opacity">ارسال</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/compose")}
        className="fixed bottom-20 right-4 w-12 h-12 bg-[#e8e6e0] rounded-full flex items-center justify-center text-[#0a0a0a] hover:opacity-90 transition-opacity z-20">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-10">
        {navItems.map((item, i) => (
          <button key={i}
            onClick={() => { if (item.path) router.push(item.path); else fetchPosts(); }}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${i === 0 ? "text-[#e8e6e0]" : "text-[#444] hover:text-[#888]"}`}>
            {item.icon}
          </button>
        ))}
      </div>

    </main>
  );
}