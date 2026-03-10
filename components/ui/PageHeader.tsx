'use client';

import React from 'react';
import { Button, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBack?: boolean;
  backHref?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  showBack = false,
  backHref,
  actions,
  children,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: 48 }}
    >


      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {showBack && (
            <Button
              type="text"
              icon={<ArrowLeft size={20} />}
              onClick={handleBack}
              className="mt-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              style={{ width: 40, height: 40 }}
            />
          )}
          <div>
            <Title
              level={2}
              style={{
                marginBottom: subtitle ? 4 : 0,
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 1.3,
              }}
            >
              {title}
            </Title>
            {subtitle && (
              <Text className="text-slate-500 text-base">{subtitle}</Text>
            )}
          </div>
        </div>

        {actions && (
          <Space wrap className="mt-2 sm:mt-0">
            {actions}
          </Space>
        )}
      </div>

      {/* Additional Content */}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}
