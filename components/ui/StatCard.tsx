'use client';

import React from 'react';
import { Card, Statistic, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';
  loading?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<string, { gradient: string; iconBg: string; iconColor: string }> = {
  blue: {
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  green: {
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  purple: {
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  orange: {
    gradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  pink: {
    gradient: 'from-pink-500/20 via-pink-500/5 to-transparent',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  cyan: {
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
};

// Map color prop to variant if provided
const colorToVariant = (color?: string): string => {
  if (!color) return 'blue';
  if (color.includes('667eea') || color === '#667eea' || color.includes('6366f1')) return 'purple';
  if (color.includes('764ba2')) return 'purple';
  if (color.includes('52c41a') || color.includes('green')) return 'green';
  if (color.includes('faad14') || color.includes('orange')) return 'orange';
  if (color.includes('cyan') || color.includes('13c2c2')) return 'cyan';
  if (color.includes('pink') || color.includes('ff1493')) return 'pink';
  return 'blue';
};

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  color,
  trend,
  description,
  variant,
  loading = false,
  onClick,
}: StatCardProps) {
  // Use variant if provided, otherwise derive from color
  const effectiveVariant = variant || colorToVariant(color);
  const styles = variantStyles[effectiveVariant];

  // Use icon if provided, otherwise use prefix
  const displayIcon = icon || prefix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
    >
      <Tooltip title={description} placement="top">
        <Card
          hoverable={!!onClick}
          onClick={onClick}
          className="relative overflow-hidden"
          styles={{
            body: { padding: '28px' },
          }}
          style={{
            borderRadius: 20,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            cursor: onClick ? 'pointer' : 'default',
            boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Gradient Background */}
          <div
            className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${styles.gradient} rounded-bl-full opacity-70 transition-all duration-300`}
            style={{ transform: 'translate(20%, -20%)' }}
          />

          {/* Decorative circle */}
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20"
            style={{
              background: color || '#667eea',
              filter: 'blur(30px)'
            }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">{title}</p>
              <div className="flex items-baseline gap-2">
                <Statistic
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  loading={loading}
                  valueStyle={{
                    fontSize: 36,
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
              </div>

              {trend && (
                <div
                  className={`flex items-center gap-1.5 mt-4 text-sm font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'
                    }`}
                >
                  {trend.isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                  <span className="text-slate-400 font-normal text-xs">vs last month</span>
                </div>
              )}
            </div>

            {displayIcon && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className={`${styles.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
                style={color ? {
                  background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
                  color: color,
                  boxShadow: `0 8px 20px -5px ${color}40`
                } : undefined}
              >
                {displayIcon}
              </motion.div>
            )}
          </div>
        </Card>
      </Tooltip>
    </motion.div>
  );
}
