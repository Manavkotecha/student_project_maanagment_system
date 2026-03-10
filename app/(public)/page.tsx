'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ArrowRight,
  Bell,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  Star,
  Mail,
  Calendar,
  Zap,
  Shield,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────── */

const features = [
  {
    icon: CalendarDays,
    title: 'Intuitive Scheduling',
    description: 'Drag-and-drop your day into shape. Smart conflict detection keeps your calendar clean and achievable.',
  },
  {
    icon: Mail,
    title: 'Real-Time Messaging',
    description: 'Instantly connect with groups or faculty. Chat naturally with teammates right where you manage your work.',
  },
  {
    icon: Users,
    title: 'Easy Collaboration',
    description: 'Share calendars, delegate tasks, and co-ordinate with your team — all from one place.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Visual dashboards reveal where your time actually goes so you can reclaim it.',
  },
];

const highlights = [
  'Role-based views for individuals & teams',
  'Smart conflict detection & resolution',
  'One-click meeting link generation',
  'Export schedules to PDF / Excel',
  'Mobile-responsive across all devices',
  'Secure, encrypted data storage',
];

const stats = [
  { value: '500+', label: 'Schedules Created', icon: Calendar },
  { value: '50+', label: 'Teams Using', icon: Users },
  { value: '200+', label: 'Reminders Daily', icon: Bell },
  { value: '98%', label: 'On-Time Rate', icon: CheckCircle2 },
];

const testimonials = [
  {
    quote: "This app keeps my Mumbai life organised. I went from missing 3 meetings a week to zero — it's become indispensable.",
    name: 'Aarav P.',
    role: 'Product Manager, Mumbai',
    initials: 'AP',
  },
  {
    quote: "Our team synced up instantly. The shared calendar alone saved us hours of back-and-forth every week.",
    name: 'Priya S.',
    role: 'Team Lead, Bengaluru',
    initials: 'PS',
  },
  {
    quote: "Clean, fast, and it just works. I set it up in 5 minutes and have been using it every day since.",
    name: 'Rohan M.',
    role: 'Freelance Consultant',
    initials: 'RM',
  },
];

/* ─── Helpers ────────────────────────────────────────────── */

function fadeInUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: 'easeOut' as const },
  };
}

function fadeInUpView(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.55, delay, ease: 'easeOut' as const },
  };
}

/* ─── Component ──────────────────────────────────────────── */

export default function LandingPage() {
  const [email, setEmail] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        overflowX: 'hidden',
        background: 'var(--bg-light)',
        color: 'var(--text-navy)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ══════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════ */}
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div className="lp-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40, height: 40,
                background: 'var(--accent-blue)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                flexShrink: 0,
              }}
            >
              <CalendarDays size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-navy)', letterSpacing: '-0.3px' }}>
              Manav&apos;s Schedule
            </span>
          </div>

          {/* Nav Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login">
              <button
                style={{
                  padding: '8px 20px',
                  border: '1.5px solid var(--accent-blue)',
                  borderRadius: 12,
                  background: 'transparent',
                  color: 'var(--accent-blue)',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-50)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                Sign In
              </button>
            </Link>
            <Link href="/login" className="lp-nav-signup">
              <button
                style={{
                  padding: '8px 22px',
                  background: 'var(--accent-blue)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,123,255,0.35)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-blue-hover)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-blue)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #E6F0FF 60%, #DBEAFE 100%)',
          paddingTop: 112,
          paddingBottom: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Subtle diagonal texture */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,123,255,0.03) 0px, rgba(0,123,255,0.03) 1px, transparent 1px, transparent 60px)',
            pointerEvents: 'none',
          }}
        />

        <div className="lp-container" style={{ position: 'relative' }}>
          <div className="lp-grid-2" style={{ minHeight: 520 }}>
            {/* ── Left: Copy ── */}
            <div style={{ paddingBlock: '32px 64px' }}>
              {/* Trust badge */}
              <motion.div
                {...fadeInUp(0)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(0,123,255,0.08)',
                  border: '1px solid rgba(0,123,255,0.2)',
                  borderRadius: 999,
                  padding: '6px 16px',
                  marginBottom: 24,
                }}
              >
                <Star size={14} fill="#007BFF" color="#007BFF" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>
                  Trusted by Busy Professionals in Mumbai
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                {...fadeInUp(0.1)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: 'var(--text-navy)',
                  marginBottom: 20,
                  letterSpacing: '-0.5px',
                }}
              >
                Manage Your Schedule<br />
                with{' '}
                <span style={{ color: 'var(--accent-blue)', position: 'relative' }}>
                  Confidence
                  {/* underline accent */}
                  <svg
                    viewBox="0 0 240 12" fill="none"
                    style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 10 }}
                  >
                    <path d="M2 8 C60 2, 180 2, 238 8" stroke="#007BFF" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.4" />
                  </svg>
                </span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                {...fadeInUp(0.2)}
                style={{ fontSize: '1.1rem', color: 'var(--secondary-text)', lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}
              >
                A seamless platform to organise tasks, set reminders, track progress,
                and collaborate — all from one intuitive dashboard.
              </motion.p>

              {/* CTAs */}
              <motion.div
                {...fadeInUp(0.3)}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}
              >
                <Link href="/login">
                  <button
                    id="hero-cta-primary"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'var(--accent-blue)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      padding: '14px 28px',
                      fontSize: 16, fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(0,123,255,0.38)',
                      transition: 'all 0.22s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-blue-hover)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-blue)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    }}
                  >
                    Get Started Free <ArrowRight size={18} />
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* ── Right: SVG Wave Shape ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="lp-hero-right"
            >
              {/* Floating schedule card – decorative */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: 60, left: 20, zIndex: 10,
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,123,255,0.14)',
                  padding: '14px 18px',
                  minWidth: 200,
                  border: '1px solid #DBEAFE',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={16} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--secondary-text)', margin: 0 }}>Next Meeting</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-navy)', margin: 0 }}>Team Standup</p>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--secondary-text)', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <CalendarDays size={12} color="var(--accent-blue)" />
                  Today · 10:00 AM
                </div>
              </motion.div>

              {/* Reminder badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute', top: 200, right: 0, zIndex: 10,
                  background: 'var(--accent-blue)',
                  borderRadius: 12,
                  padding: '10px 16px',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(0,123,255,0.4)',
                }}
              >
                <Bell size={16} color="#fff" />
                <span style={{ fontWeight: 600, fontSize: 13 }}>3 reminders set</span>
              </motion.div>

              {/* The big wavy SVG */}
              <div className="animate-wave-sway" style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', maxWidth: 430 }}>
                <svg viewBox="0 0 440 520" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
                  <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#007BFF" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#339CFF" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0056b3" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {/* Main flowing shape */}
                  <path
                    d="M 380 30
                       C 430 80, 420 180, 380 240
                       C 340 300, 280 290, 260 360
                       C 240 430, 290 490, 260 520
                       L 60 520
                       C 30 480, 80 400, 60 330
                       C 40 260, -10 220, 20 150
                       C 50 80, 140 40, 200 20
                       C 260 0, 330 -20, 380 30 Z"
                    fill="url(#waveGrad)"
                  />

                  {/* Second overlapping shape for depth */}
                  <path
                    d="M 420 100
                       C 450 160, 440 260, 400 320
                       C 360 380, 290 370, 280 440
                       C 270 490, 310 510, 300 520
                       L 180 520
                       C 160 490, 200 440, 190 380
                       C 180 320, 120 290, 140 220
                       C 160 150, 240 120, 300 100
                       C 360 80, 390 40, 420 100 Z"
                    fill="url(#waveGrad2)"
                    opacity="0.55"
                  />

                  {/* Decorative circles */}
                  <circle cx="200" cy="160" r="6" fill="#fff" opacity="0.5" />
                  <circle cx="320" cy="280" r="9" fill="#fff" opacity="0.35" />
                  <circle cx="160" cy="380" r="5" fill="#fff" opacity="0.4" />
                  <circle cx="360" cy="420" r="7" fill="#fff" opacity="0.3" />

                  {/* Calendar grid inside shape */}
                  <g opacity="0.25">
                    <rect x="130" y="200" width="160" height="120" rx="12" fill="#fff" />
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                      <rect key={i} x={140 + i * 20} y="220" width="12" height="12" rx="3" fill="#007BFF" opacity={i % 3 === 0 ? 0.9 : 0.4} />
                    ))}
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                      <rect key={i} x={140 + i * 20} y="242" width="12" height="12" rx="3" fill="#007BFF" opacity={i % 2 === 1 ? 0.9 : 0.3} />
                    ))}
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                      <rect key={i} x={140 + i * 20} y="264" width="12" height="12" rx="3" fill="#007BFF" opacity={i === 3 ? 1 : 0.2} />
                    ))}
                  </g>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div style={{ background: 'var(--text-navy)', marginTop: 0 }}>
          <div className="lp-container">
            <div className="lp-stats-grid">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...fadeInUpView(i * 0.1)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '24px 28px',
                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(0,123,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <stat.icon size={20} color="var(--accent-blue-mid)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '96px 0', background: '#fff' }}>
        <div className="lp-container">
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <motion.span
              {...fadeInUpView()}
              style={{
                display: 'inline-block',
                background: 'var(--primary-50)', color: 'var(--accent-blue)',
                borderRadius: 999, padding: '4px 16px', fontSize: 13, fontWeight: 600, marginBottom: 16,
              }}
            >
              EVERYTHING YOU NEED
            </motion.span>
            <motion.h2
              {...fadeInUpView(0.1)}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 800, color: 'var(--text-navy)', marginBottom: 14,
              }}
            >
              Powerful Features, Zero Complexity
            </motion.h2>
            <motion.p
              {...fadeInUpView(0.2)}
              style={{ fontSize: '1.05rem', color: 'var(--secondary-text)', maxWidth: 540, margin: '0 auto' }}
            >
              Built for individual focus and team co-ordination — everything in one clean dashboard.
            </motion.p>
          </div>

          {/* Cards grid */}
          <div className="lp-grid-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                {...fadeInUpView(i * 0.08)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '32px 24px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s',
                  cursor: 'default',
                }}
                whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,123,255,0.12)', borderColor: 'var(--accent-blue)' }}
              >
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'var(--primary-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <feat.icon size={26} color="var(--accent-blue)" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-navy)', marginBottom: 10, fontFamily: 'var(--font-sans)' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--secondary-text)', lineHeight: 1.7 }}>
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HIGHLIGHTS / BENEFITS SECTION
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '96px 0',
          background: 'linear-gradient(135deg, var(--text-navy) 0%, #00336A 100%)',
        }}
      >
        <div className="lp-container">
          <div className="lp-grid-2">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }} viewport={{ once: true }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(0,123,255,0.25)', color: 'var(--accent-blue-mid)',
                  borderRadius: 999, padding: '4px 16px', fontSize: 13, fontWeight: 600, marginBottom: 20,
                }}
              >
                BUILT FOR MODERN LIFE
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 16,
                }}
              >
                One App for Everything on Your Plate
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 36 }}>
                Manav&apos;s Schedule empowers you and your team to plan smarter,
                not harder — with features designed for real-world productivity.
              </p>
              <div style={{ display: 'grid', gap: 16 }}>
                {highlights.map((h, i) => (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(0,123,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={15} color="var(--accent-blue-mid)" />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, fontSize: 15 }}>{h}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right stats cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }} viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}
            >
              {[
                { icon: Zap, title: 'Fast', sub: 'Lightning performance' },
                { icon: Shield, title: 'Secure', sub: 'Encrypted & private' },
                { icon: CalendarDays, title: 'Smart', sub: 'AI-powered suggestions' },
                { icon: Users, title: 'Co-op', sub: 'Real-time team sync' },
              ].map(card => (
                <div
                  key={card.title}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 18,
                    padding: '28px 20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)',
                    transition: 'background 0.2s',
                  }}
                >
                  <card.icon size={34} color="var(--accent-blue-mid)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{card.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{card.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '96px 0', background: 'var(--bg-light)' }}>
        <div className="lp-container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <motion.h2
              {...fadeInUpView()}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 800, color: 'var(--text-navy)', marginBottom: 12,
              }}
            >
              Loved by Professionals
            </motion.h2>
            <motion.p
              {...fadeInUpView(0.1)}
              style={{ fontSize: '1.05rem', color: 'var(--secondary-text)' }}
            >
              Real stories from people who got their time back.
            </motion.p>
          </div>

          <div className="lp-grid-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeInUpView(i * 0.1)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '32px 28px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
                  position: 'relative',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,123,255,0.1)' }}
              >
                {/* Quote mark */}
                <span
                  style={{
                    position: 'absolute', top: 20, right: 24,
                    fontSize: 64, lineHeight: 1, color: 'var(--primary-100)',
                    fontFamily: 'Georgia, serif', fontWeight: 900,
                  }}
                >
                  &ldquo;
                </span>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="var(--accent-blue)" color="var(--accent-blue)" />
                  ))}
                </div>

                <p style={{ fontSize: 15, color: 'var(--text-navy)', lineHeight: 1.8, marginBottom: 24, opacity: 0.85 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'var(--accent-blue)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-navy)', fontSize: 14, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--secondary-text)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--accent-blue)', padding: '80px 0' }}>
        <div className="lp-container" style={{ maxWidth: 760, textAlign: 'center' }}>
          <motion.div
            {...fadeInUpView()}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.25,
              }}
            >
              Start Scheduling Smarter Today
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: 36 }}>
              Join thousands of professionals who plan better with Manav&apos;s Schedule.
              No credit card required.
            </p>

            {/* Email sign-up */}
            <form
              onSubmit={e => { e.preventDefault(); window.location.href = '/login'; }}
              style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <input
                id="cta-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  flex: '1 1 260px', maxWidth: 320,
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: '2px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: 15,
                  outline: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              />
              <button
                id="cta-join-btn"
                type="submit"
                style={{
                  padding: '14px 28px',
                  background: '#fff',
                  color: 'var(--accent-blue)',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                Join Free →
              </button>
            </form>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 16 }}>
              Free forever plan available · No spam ever
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{ background: 'var(--text-navy)', padding: '48px 0 32px' }}>
        <div className="lp-container">
          <div className="lp-footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'var(--accent-blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays size={20} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Manav&apos;s Schedule</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7 }}>
                A personal scheduling platform for professionals who value their time.
              </p>
            </div>

            {/* Links */}
            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { heading: 'Support', links: ['Help Center', 'Privacy', 'Terms', 'Contact'] },
            ].map(col => (
              <div key={col.heading}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {col.heading}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <a
                      key={link} href="#"
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-blue-mid)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 24,
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'space-between', alignItems: 'center', gap: 12,
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              © {new Date().getFullYear()} Manav&apos;s Schedule. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Mail size={14} color="rgba(255,255,255,0.35)" />
              <a
                href="mailto:hello@manavschedule.in"
                style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none' }}
              >
                hello@manavschedule.in
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
