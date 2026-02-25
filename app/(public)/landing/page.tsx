'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    FolderKanban,
    Calendar,
    Users,
    Shield,
    BarChart3,
    Zap,
    ArrowRight,
    CheckCircle2,
    UserPlus,
    Layers,
    ChevronRight,
    BookOpen,
    Award,
    Settings,
    Star,
} from 'lucide-react';

/* ─────────── animation helpers ─────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
};

/* ─────────── data ─────────── */
const features = [
    {
        icon: FolderKanban,
        title: 'Project Groups',
        desc: 'Organize students into collaborative project groups with team leaders and members.',
        gradient: 'from-indigo-500 to-indigo-600',
        shadow: 'rgba(99,102,241,0.35)',
        bg: 'from-indigo-50 to-indigo-100',
    },
    {
        icon: Calendar,
        title: 'Meeting Scheduler',
        desc: 'Schedule, track, and manage project review meetings with smart calendar integration.',
        gradient: 'from-orange-500 to-orange-600',
        shadow: 'rgba(249,115,22,0.35)',
        bg: 'from-orange-50 to-orange-100',
    },
    {
        icon: CheckCircle2,
        title: 'Attendance Tracking',
        desc: 'Real-time attendance management for meetings with detailed present/absent analytics.',
        gradient: 'from-emerald-500 to-emerald-600',
        shadow: 'rgba(16,185,129,0.35)',
        bg: 'from-emerald-50 to-emerald-100',
    },
    {
        icon: Shield,
        title: 'Role-Based Access',
        desc: 'Separate dashboards for students, faculty, and admins with fine-grained permissions.',
        gradient: 'from-purple-500 to-purple-600',
        shadow: 'rgba(168,85,247,0.35)',
        bg: 'from-purple-50 to-purple-100',
    },
    {
        icon: BarChart3,
        title: 'Progress Reports',
        desc: 'Auto-generated reports and charts that give insights into project milestones and timelines.',
        gradient: 'from-cyan-500 to-cyan-600',
        shadow: 'rgba(6,182,212,0.35)',
        bg: 'from-cyan-50 to-cyan-100',
    },
    {
        icon: Zap,
        title: 'Real-time Updates',
        desc: 'Instant notifications and live data sync so everyone stays on the same page.',
        gradient: 'from-pink-500 to-pink-600',
        shadow: 'rgba(236,72,153,0.35)',
        bg: 'from-pink-50 to-pink-100',
    },
];

const steps = [
    {
        num: '01',
        icon: UserPlus,
        title: 'Sign Up',
        desc: 'Create your account in seconds — choose your role as a student or faculty.',
    },
    {
        num: '02',
        icon: Layers,
        title: 'Join or Create Projects',
        desc: 'Form project groups, invite teammates, and get assigned to a faculty guide.',
    },
    {
        num: '03',
        icon: BarChart3,
        title: 'Track & Collaborate',
        desc: 'Schedule meetings, mark attendance, track progress, and generate reports.',
    },
];

const roles = [
    {
        icon: BookOpen,
        title: 'Student',
        desc: 'View your groups, attend meetings, track attendance, and manage your academic profile.',
        gradient: 'from-indigo-500 to-purple-600',
        shadow: 'rgba(99,102,241,0.4)',
        items: ['Dashboard & analytics', 'Group management', 'Meeting schedule', 'Profile management'],
    },
    {
        icon: Award,
        title: 'Faculty',
        desc: 'Guide student projects, schedule review meetings, and monitor group progress.',
        gradient: 'from-orange-500 to-pink-600',
        shadow: 'rgba(249,115,22,0.4)',
        items: ['Project oversight', 'Meeting scheduling', 'Attendance tracking', 'Progress reports'],
    },
    {
        icon: Settings,
        title: 'Admin',
        desc: 'Full system control — manage users, departments, project types, and system settings.',
        gradient: 'from-emerald-500 to-cyan-600',
        shadow: 'rgba(16,185,129,0.4)',
        items: ['User management', 'Department control', 'System configuration', 'Data exports'],
    },
];

/* ─────────── component ─────────── */
export default function LandingPage() {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', overflowX: 'hidden' }}>
            {/* ───── Navbar ───── */}
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(226,232,240,0.8)',
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        padding: '0 24px',
                        height: 72,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
                            }}
                        >
                            <GraduationCap size={22} color="white" />
                        </div>
                        <span
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 700,
                                fontSize: 22,
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            SPMS
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href="/login">
                            <button
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: 10,
                                    border: '1.5px solid #e2e8f0',
                                    background: 'white',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: '#475569',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.color = '#667eea';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.color = '#475569';
                                }}
                            >
                                Sign In
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(102,126,234,0.4)';
                                }}
                            >
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* ───── Hero ───── */}
            <section
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    overflow: 'hidden',
                    padding: '120px 24px 80px',
                }}
            >
                {/* floating orbs */}
                {[
                    { w: 600, t: '-15%', r: '-10%', o: 0.12, d: 18 },
                    { w: 450, t: '60%', r: '70%', o: 0.08, d: 22 },
                    { w: 300, t: '30%', r: '50%', o: 0.1, d: 15 },
                    { w: 200, t: '10%', r: '20%', o: 0.15, d: 20 },
                ].map((orb, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: orb.d, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            width: orb.w,
                            height: orb.w,
                            top: orb.t,
                            right: orb.r,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(255,255,255,${orb.o}) 0%, transparent 70%)`,
                            pointerEvents: 'none',
                        }}
                    />
                ))}

                {/* grid overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                        pointerEvents: 'none',
                    }}
                />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 800 }}
                >
                    {/* badge */}
                    <motion.div variants={fadeUp} custom={0}>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 20px',
                                borderRadius: 50,
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 500,
                                marginBottom: 32,
                            }}
                        >
                            <Star size={16} fill="white" /> Trusted by Academic Institutions
                        </span>
                    </motion.div>

                    {/* heading */}
                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: 'clamp(36px, 6vw, 64px)',
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.15,
                            marginBottom: 24,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Student Project{' '}
                        <span
                            style={{
                                background: 'linear-gradient(90deg, #fff 30%, rgba(255,255,255,0.6) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Management System
                        </span>
                    </motion.h1>

                    {/* subtitle */}
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        style={{
                            fontSize: 'clamp(16px, 2.2vw, 20px)',
                            color: 'rgba(255,255,255,0.85)',
                            maxWidth: 620,
                            margin: '0 auto 40px',
                            lineHeight: 1.7,
                            fontWeight: 400,
                        }}
                    >
                        A comprehensive platform to manage academic projects, schedule meetings,
                        track attendance, and collaborate — all from one beautiful dashboard.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link href="/signup">
                            <button
                                style={{
                                    padding: '16px 36px',
                                    borderRadius: 14,
                                    border: 'none',
                                    background: 'white',
                                    color: '#667eea',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                                }}
                            >
                                Get Started Free <ArrowRight size={18} />
                            </button>
                        </Link>
                        <Link href="/login">
                            <button
                                style={{
                                    padding: '16px 36px',
                                    borderRadius: 14,
                                    border: '2px solid rgba(255,255,255,0.4)',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    transition: 'all 0.3s',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                }}
                            >
                                Sign In <ChevronRight size={18} />
                            </button>
                        </Link>
                    </motion.div>

                    {/* stats row */}
                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 48,
                            marginTop: 64,
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { value: '500+', label: 'Students' },
                            { value: '50+', label: 'Faculty' },
                            { value: '200+', label: 'Projects' },
                        ].map((stat) => (
                            <div key={stat.label} style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: 32,
                                        fontWeight: 800,
                                        color: 'white',
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ───── Features ───── */}
            <section style={{ padding: '100px 24px', background: '#f8fafc' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 64 }}
                    >
                        <motion.span
                            variants={fadeUp}
                            custom={0}
                            style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: 50,
                                background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                                color: '#6366f1',
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 16,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Features
                        </motion.span>
                        <motion.h2
                            variants={fadeUp}
                            custom={1}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 'clamp(28px, 4vw, 42px)',
                                fontWeight: 700,
                                color: '#0f172a',
                                marginBottom: 16,
                            }}
                        >
                            Everything You Need to{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Succeed
                            </span>
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            style={{ color: '#64748b', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}
                        >
                            Powerful tools designed specifically for academic project management to
                            streamline collaboration between students and faculty.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: 28,
                        }}
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                style={{
                                    background: 'white',
                                    borderRadius: 20,
                                    padding: 32,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                    transition: 'box-shadow 0.3s, border-color 0.3s',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px -12px ${f.shadow}`;
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                                }}
                            >
                                <div
                                    className={`bg-gradient-to-br ${f.gradient}`}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 20,
                                        boxShadow: `0 8px 20px -4px ${f.shadow}`,
                                    }}
                                >
                                    <f.icon size={26} color="white" />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: 20,
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        marginBottom: 10,
                                    }}
                                >
                                    {f.title}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ───── How It Works ───── */}
            <section
                style={{
                    padding: '100px 24px',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 64 }}
                    >
                        <motion.span
                            variants={fadeUp}
                            custom={0}
                            style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: 50,
                                background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                                color: '#059669',
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 16,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            How It Works
                        </motion.span>
                        <motion.h2
                            variants={fadeUp}
                            custom={1}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 'clamp(28px, 4vw, 42px)',
                                fontWeight: 700,
                                color: '#0f172a',
                                marginBottom: 16,
                            }}
                        >
                            Get Started in{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                3 Simple Steps
                            </span>
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 32,
                        }}
                    >
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.num}
                                variants={fadeUp}
                                custom={i}
                                style={{
                                    position: 'relative',
                                    background: 'white',
                                    borderRadius: 24,
                                    padding: '40px 32px',
                                    border: '1px solid #e2e8f0',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.06)',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* big number watermark */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -10,
                                        right: 16,
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: 120,
                                        fontWeight: 800,
                                        color: 'rgba(99,102,241,0.05)',
                                        lineHeight: 1,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {s.num}
                                </div>

                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 20,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
                                    }}
                                >
                                    <s.icon size={28} color="white" />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: 22,
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        marginBottom: 12,
                                    }}
                                >
                                    {s.title}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                                    {s.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ───── Roles ───── */}
            <section style={{ padding: '100px 24px', background: '#f8fafc' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 64 }}
                    >
                        <motion.span
                            variants={fadeUp}
                            custom={0}
                            style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: 50,
                                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                                color: '#d97706',
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 16,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            For Everyone
                        </motion.span>
                        <motion.h2
                            variants={fadeUp}
                            custom={1}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 'clamp(28px, 4vw, 42px)',
                                fontWeight: 700,
                                color: '#0f172a',
                                marginBottom: 16,
                            }}
                        >
                            Built for Every{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Role
                            </span>
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            style={{ color: '#64748b', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}
                        >
                            Tailored experiences for students, faculty, and administrators — each
                            with the tools they need.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: 28,
                        }}
                    >
                        {roles.map((r, i) => (
                            <motion.div
                                key={r.title}
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                style={{
                                    background: 'white',
                                    borderRadius: 24,
                                    padding: 36,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.06)',
                                    transition: 'box-shadow 0.3s, border-color 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px -12px ${r.shadow}`;
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px -5px rgba(0,0,0,0.06)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                                }}
                            >
                                <div
                                    className={`bg-gradient-to-br ${r.gradient}`}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 24,
                                        boxShadow: `0 8px 24px -4px ${r.shadow}`,
                                    }}
                                >
                                    <r.icon size={30} color="white" />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: 24,
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        marginBottom: 12,
                                    }}
                                >
                                    {r.title}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                                    {r.desc}
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {r.items.map((item) => (
                                        <li
                                            key={item}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '8px 0',
                                                color: '#475569',
                                                fontSize: 14,
                                                fontWeight: 500,
                                            }}
                                        >
                                            <CheckCircle2 size={16} color="#10b981" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ───── CTA ───── */}
            <section style={{ padding: '100px 24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    style={{
                        maxWidth: 900,
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        borderRadius: 32,
                        padding: 'clamp(40px, 6vw, 72px)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 25px 60px -12px rgba(102,126,234,0.4)',
                    }}
                >
                    {/* decorative circles */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -60,
                            right: -60,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -40,
                            left: -40,
                            width: 160,
                            height: 160,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.06)',
                            pointerEvents: 'none',
                        }}
                    />

                    <h2
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: 'clamp(26px, 4vw, 40px)',
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: 16,
                            position: 'relative',
                        }}
                    >
                        Ready to Transform Your Academic Projects?
                    </h2>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: 17,
                            maxWidth: 520,
                            margin: '0 auto 36px',
                            lineHeight: 1.7,
                            position: 'relative',
                        }}
                    >
                        Join hundreds of students and faculty who are already using SPMS
                        to streamline their project management workflow.
                    </p>
                    <Link href="/signup" style={{ position: 'relative', zIndex: 1 }}>
                        <button
                            style={{
                                padding: '16px 40px',
                                borderRadius: 14,
                                border: 'none',
                                background: 'white',
                                color: '#667eea',
                                fontWeight: 700,
                                fontSize: 16,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                            }}
                        >
                            Create Free Account <ArrowRight size={18} />
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* ───── Footer ───── */}
            <footer
                style={{
                    background: '#0f172a',
                    padding: '48px 24px',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <GraduationCap size={18} color="white" />
                    </div>
                    <span
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                            fontSize: 18,
                            color: 'white',
                        }}
                    >
                        SPMS
                    </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
                    Student Project Management System — Empowering academic collaboration.
                </p>
                <p style={{ color: '#64748b', fontSize: 13 }}>
                    © {new Date().getFullYear()} SPMS. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
