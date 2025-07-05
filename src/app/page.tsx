"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

// Import IBM Plex Sans from Google Fonts
if (typeof window !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Typing effect for headline
const TypingHeadline = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 32);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
};

// Feature reveal animation (fade in)
const FeatureLine = ({ children, delay }: { children: ReactNode; delay: number }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`text-[#bdbec2] text-base font-sans transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
    >
      {children}
    </div>
  );
};

// Font-face for WDXL Lubrifont SC (if not on Google Fonts, use fallback)
const wdxlFont = {
  fontFamily: 'WDXL Lubrifont SC, sans-serif',
  fontWeight: 700,
  letterSpacing: '0.02em',
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [submitted]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative"
      style={{
        background: "radial-gradient(ellipse at 60% 40%, #23232a 60%, #101014 100%)",
        fontFamily: 'IBM Plex Sans, sans-serif',
        color: '#e0e0e0',
      }}
    >
      {/* Subtle vignette for depth */}
      <div
        aria-hidden
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(ellipse at 60% 40%, transparent 60%, #101014 100%)',
          opacity: 0.7,
        }}
      />
      {/* Fixed Logo - does not move on scroll */}
      <img
        src="/image.png"
        alt="Superkontext Logo"
        className="fixed top-6 left-6 h-10 w-auto border border-transparent rounded-lg shadow-none z-20"
        style={{ filter: 'grayscale(0.1) brightness(2.8)', opacity: 0.48, background: 'transparent', border: 'none' }}
      />
      {/* Main Content */}
      <header className="w-full flex items-center justify-start mb-12 mt-4" />
      {/* Main Card */}
      <main className="w-full max-w-lg mx-auto flex flex-col items-center justify-center rounded-xl shadow-xl px-5 py-8 border border-[#23232a]/80 bg-[rgba(24,24,28,0.92)] relative z-10 animate-fadein" style={{ fontFamily: 'IBM Plex Sans, sans-serif', boxShadow: '0 4px 16px 0 rgba(24,24,28,0.14)' }}>
        {/* Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center tracking-tight mb-1 select-none text-[#f8f8ff] font-sans" style={{ fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.01em', lineHeight: 1.1 }}>
          <TypingHeadline text="Superkontext: 10x Your AI Responses" />
        </h1>
        {/* Accent line */}
        <div className="w-10 h-0.5 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#bdbec2] via-[#533d3d] to-[#bdbec2] opacity-40" />
        {/* Subheadline */}
        <div className="text-base sm:text-lg text-[#bdbec2] text-center mb-6 font-sans font-normal" style={{ fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.35 }}>
          Get 10x better AI responses—no prompt engineering, no hassle.<br />Superkontext delivers expert context and advanced prompting, automatically.
        </div>
        {/* Features */}
        <div className="flex flex-col gap-2 w-full max-w-sm mx-auto mb-6">
          <FeatureLine delay={400}>&gt; Instantly boost the quality of any AI output</FeatureLine>
          <FeatureLine delay={900}>&gt; No manual prompt tuning or technical know-how needed</FeatureLine>
          <FeatureLine delay={1400}>&gt; Save time and unlock new creative possibilities</FeatureLine>
          <FeatureLine delay={1900}>&gt; Effortlessly scale and adapt to any use case</FeatureLine>
        </div>
        {/* Waitlist Form */}
        {!submitted ? (
          <form
            className="flex flex-row gap-2 w-full max-w-sm mx-auto items-center justify-center mt-1"
            onSubmit={async e => {
              e.preventDefault();
              setError(null);
              if (!email) return;
              setLoading(true);
              try {
                const res = await fetch('/api/waitlist', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                });
                const data = await res.json();
                if (data.success) {
                  setSubmitted(true);
                } else {
                  setError(data.error || 'Something went wrong.');
                }
              } catch (err) {
                setError('Network error.');
              } finally {
                setLoading(false);
              }
            }}
            autoComplete="off"
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-[#18181c] text-[#f8f8ff] rounded-md font-sans text-base focus:outline-none focus:ring-2 focus:ring-[#3a3938] placeholder-[#444] caret-[#fc8] border border-transparent focus:border-[#282622] transition-all"
              style={{ fontFamily: 'IBM Plex Sans, sans-serif', boxShadow: '0 1px 4px 0 #3a3938' }}
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#533d3d] text-[#23232a] font-bold font-sans text-base border border-[#282622] hover:bg-[#fff8e1] hover:text-[#23232a] transition-colors text-base shadow-sm"
              style={{ fontFamily: 'IBM Plex Sans, sans-serif', boxShadow: '0 0 6px 0 #533d3d' }}
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        ) : (
          <div className="mt-6 text-[#bdbec2] text-base font-sans text-center animate-fadein">Request received. <span className="animate-pulse">_</span></div>
        )}
        {error && (
          <div className="mt-2 text-[#ff6b6b] text-sm text-center animate-fadein">{error}</div>
        )}
      </main>
      {/* Social Proof at the bottom */}
      <footer className="w-full text-center mt-10 mb-2 text-[#7a7a85] text-sm font-sans" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
        <span>~ We are <span className="text-[#ca8]">1+</span> people in our <span className="text-[#ffe0ff]">Waitlist</span>, join now!</span>
        <p className="text-xs text-[#aa8888]">coming this July!</p>
      </footer>
    </div>
  );
}