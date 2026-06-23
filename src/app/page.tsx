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
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e8e6e0",
      display: "flex",
      fontFamily: "Vazirmatn, sans-serif",
    }}>

      {/* سمت چپ */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 4rem",
        gap: "2.5rem",
      }}>
        <svg width="180" height="220" viewBox="0 0 110 140" fill="none">
          <rect x="36" y="0" width="4" height="8" fill="#cc2222"/>
          <rect x="36" y="122" width="4" height="8" fill="#cc2222"/>
          <line x1="38" y1="0" x2="38" y2="130" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="2" y1="18" x2="88" y2="18" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="88" y1="18" x2="54" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
          <line x1="54" y1="100" x2="38" y2="100" stroke="#e8e6e0" strokeWidth="1.5"/>
        </svg>
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.25em",
            color: "#444",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            A new social experience
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#e8e6e0",
          }}>
            Somewhere you belong.
          </h1>
        </div>
      </div>

      {/* خط جداکننده */}
      <div style={{ width: "1px", background: "#141414" }} />

      {/* سمت راست */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 4rem",
      }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: 500,
          textAlign: "right",
          color: "#e8e6e0",
          marginBottom: "6px",
        }}>
          به دژاوو بپیوند
        </h2>
        <p style={{
          fontSize: "13px",
          color: "#444",
          textAlign: "right",
          marginBottom: "32px",
          direction: "rtl",
        }}>
          داستانت رو با دنیا به اشتراک بذار
        </p>

        <input
          type="text"
          placeholder="ایمیل یا شماره موبایل"
          dir="rtl"
          value={contact}
          onChange={(e) => { setContact(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "transparent",
            border: "1px solid #1e1e1e",
            borderRadius: "8px",
            color: "#e8e6e0",
            fontSize: "14px",
            fontFamily: "Vazirmatn, sans-serif",
            outline: "none",
            textAlign: "right",
            marginBottom: "10px",
          }}
        />

        {error && (
          <p style={{ fontSize: "11px", color: "#ef4444", textAlign: "right", marginBottom: "8px" }} dir="rtl">
            {error}
          </p>
        )}

        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#e8e6e0",
            border: "none",
            borderRadius: "8px",
            color: "#0a0a0a",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Vazirmatn, sans-serif",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          ثبت‌نام
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
          <span style={{ fontSize: "11px", color: "#333" }}>قبلاً ثبت‌نام کردی؟</span>
          <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        </div>

        <button
          onClick={() => router.push("/login")}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#e8e6e0",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Vazirmatn, sans-serif",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ورود به حساب
        </button>

        <p style={{
          fontSize: "11px",
          color: "#333",
          textAlign: "right",
          lineHeight: 1.8,
          direction: "rtl",
        }}>
          با ادامه،{" "}
          <span style={{ textDecoration: "underline", color: "#555", cursor: "pointer" }}>شرایط استفاده</span>
          {" "}و{" "}
          <span style={{ textDecoration: "underline", color: "#555", cursor: "pointer" }}>سیاست حریم خصوصی</span>
          {" "}دژاوو را می‌پذیری.
        </p>
      </div>

    </main>
  );
}