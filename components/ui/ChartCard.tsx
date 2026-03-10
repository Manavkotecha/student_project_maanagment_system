'use client';

import React from 'react';
import { Card, Empty, Spin } from 'antd';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from 'recharts';

interface ChartCardProps {
  title: string;
  extra?: React.ReactNode;
  loading?: boolean;
  height?: number;
  children: React.ReactNode;
}

// Wrapper card for charts
export function ChartCard({ title, extra, loading, height = 300, children }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card
        title={<span className="font-semibold text-slate-700">{title}</span>}
        extra={extra}
        styles={{
          body: { padding: '16px 24px 24px' },
          header: { borderBottom: '1px solid #e2e8f0' },
        }}
        style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
      >
        {loading ? (
          <div style={{ height }} className="flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ height }}>{children}</div>
        )}
      </Card>
    </motion.div>
  );
}

// Modern color palette
const COLORS = {
  primary: ['#007BFF', '#339CFF', '#60A5FA', '#93C5FD', '#DBEAFE'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  accent: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe'],
  pink: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3'],
};

// Bar Chart Component
interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ModernBarChartProps {
  data: BarChartData[];
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  showGrid?: boolean;
}

export function ModernBarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  color = COLORS.primary[0],
  showGrid = true,
}: ModernBarChartProps) {
  if (!data || data.length === 0) {
    return <Empty description="No data available" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          }}
        />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Donut/Pie Chart Component
interface PieChartData {
  name: string;
  value: number;
}

interface ModernPieChartProps {
  data: PieChartData[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
}

export function ModernPieChart({
  data,
  colors = COLORS.primary,
  innerRadius = 60,
  outerRadius = 100,
  showLabel = true,
}: ModernPieChartProps) {
  if (!data || data.length === 0) {
    return <Empty description="No data available" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          dataKey="value"
          animationDuration={1000}
          label={showLabel}
          labelLine={showLabel}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Line/Area Chart Component
interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface ModernLineChartProps {
  data: LineChartData[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey?: string;
  showArea?: boolean;
  showGrid?: boolean;
}

export function ModernLineChart({
  data,
  dataKeys,
  xAxisKey = 'name',
  showArea = true,
  showGrid = true,
}: ModernLineChartProps) {
  if (!data || data.length === 0) {
    return <Empty description="No data available" />;
  }

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient key={dk.key} id={`gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dk.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={dk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        {dataKeys.map((dk) =>
          showArea ? (
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name || dk.key}
              stroke={dk.color}
              strokeWidth={2}
              fill={`url(#gradient-${dk.key})`}
              animationDuration={1500}
            />
          ) : (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name || dk.key}
              stroke={dk.color}
              strokeWidth={2}
              dot={{ fill: dk.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={1500}
            />
          )
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}

export { COLORS };
