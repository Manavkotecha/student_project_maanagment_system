'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Skeleton({ className = '', width, height, rounded = 'md' }: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton width={100} height={16} className="mb-3" />
          <Skeleton width={80} height={36} className="mb-3" />
          <Skeleton width={140} height={14} />
        </div>
        <Skeleton width={48} height={48} rounded="xl" />
      </div>
    </div>
  );
}

export function ChartCardSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <Skeleton width={150} height={20} />
      </div>
      <div className="p-6" style={{ height }}>
        <Skeleton width="100%" height="100%" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4">
        <Skeleton width="25%" height={16} />
        <Skeleton width="20%" height={16} />
        <Skeleton width="20%" height={16} />
        <Skeleton width="15%" height={16} />
        <Skeleton width="10%" height={16} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-slate-100 flex gap-4 items-center">
          <Skeleton width="25%" height={14} />
          <Skeleton width="20%" height={14} />
          <Skeleton width="20%" height={14} />
          <Skeleton width="15%" height={14} />
          <Skeleton width={60} height={28} rounded="full" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton width={48} height={48} rounded="full" />
        <div className="flex-1">
          <Skeleton width="60%" height={18} className="mb-2" />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <Skeleton width="100%" height={12} className="mb-2" />
      <Skeleton width="80%" height={12} className="mb-2" />
      <Skeleton width="90%" height={12} />
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <Skeleton width={40} height={40} rounded="lg" />
          <div className="flex-1">
            <Skeleton width="50%" height={16} className="mb-2" />
            <Skeleton width="70%" height={12} />
          </div>
          <Skeleton width={60} height={24} rounded="full" />
        </div>
      ))}
    </div>
  );
}
