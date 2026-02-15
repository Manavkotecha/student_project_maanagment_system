'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Space } from 'antd';
import {
  GraduationCap,
  Users,
  Calendar,
  BarChart3,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Organize and track student projects from proposal to completion with intuitive group management.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Form project groups, assign guides, and collaborate seamlessly with role-based access control.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: Calendar,
    title: 'Meeting Scheduler',
    description: 'Schedule, track, and manage project meetings with attendance tracking and notes.',
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Generate comprehensive reports with insights on project progress, attendance, and performance.',
    color: 'from-emerald-500 to-teal-600',
  },
];

const stats = [
  { value: '500+', label: 'Projects Managed' },
  { value: '1,200+', label: 'Active Students' },
  { value: '150+', label: 'Faculty Guides' },
  { value: '98%', label: 'Success Rate' },
];

const highlights = [
  'Role-based dashboards for Admin, Faculty & Students',
  'Real-time project progress tracking',
  'Automated meeting attendance system',
  'Export reports to PDF / Excel',
  'Mobile-responsive design',
  'Secure authentication & data protection',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">SPMS</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Student Project Management</p>
              </div>
            </div>
            <Space>
              <Link href="/login">
                <Button type="text" className="font-medium text-slate-600 hover:text-indigo-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  type="primary"
                  className="font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: 10,
                    height: 40,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-100 via-purple-50 to-transparent opacity-60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100 via-cyan-50 to-transparent opacity-60 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-violet-50 to-transparent opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
            >
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                Trusted by 50+ Institutions
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Manage Academic Projects
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                With Excellence
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            >
              A comprehensive platform for managing student academic projects, team collaboration,
              and progress tracking — all in one powerful, intuitive system.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/signup">
                <Button
                  size="large"
                  type="primary"
                  icon={<ArrowRight size={18} />}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: 12,
                    height: 52,
                    paddingLeft: 28,
                    paddingRight: 28,
                    fontSize: 16,
                    boxShadow: '0 8px 30px -10px rgba(99, 102, 241, 0.6)',
                  }}
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="large"
                  className="w-full sm:w-auto font-semibold"
                  style={{
                    borderRadius: 12,
                    height: 52,
                    paddingLeft: 28,
                    paddingRight: 28,
                    fontSize: 16,
                    borderColor: '#e2e8f0',
                  }}
                >
                  Sign In to Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-slate-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            >
              Everything You Need
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Powerful features designed to streamline academic project management
              from start to finish.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Built for Modern Education
              </h2>
              <p className="text-lg text-indigo-100 mb-8">
                SPMS empowers institutions to manage academic projects efficiently with
                features designed specifically for the education sector.
              </p>
              <div className="grid gap-4">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-white font-medium">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <Shield size={32} className="text-white mx-auto mb-3" />
                    <p className="text-white font-semibold">Secure</p>
                    <p className="text-indigo-200 text-sm">Enterprise-grade security</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <Zap size={32} className="text-white mx-auto mb-3" />
                    <p className="text-white font-semibold">Fast</p>
                    <p className="text-indigo-200 text-sm">Lightning performance</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <Globe size={32} className="text-white mx-auto mb-3" />
                    <p className="text-white font-semibold">Accessible</p>
                    <p className="text-indigo-200 text-sm">Anywhere, anytime</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <Sparkles size={32} className="text-white mx-auto mb-3" />
                    <p className="text-white font-semibold">Modern</p>
                    <p className="text-indigo-200 text-sm">Cutting-edge UI/UX</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-lg text-slate-600 mb-10">
              Join hundreds of institutions already using SPMS to manage their academic projects
              more efficiently.
            </p>
            <Link href="/signup">
              <Button
                size="large"
                type="primary"
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: 12,
                  height: 56,
                  paddingLeft: 40,
                  paddingRight: 40,
                  fontSize: 16,
                  boxShadow: '0 8px 30px -10px rgba(99, 102, 241, 0.6)',
                }}
              >
                Get Started for Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-bold text-white">SPMS</span>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Student Project Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
