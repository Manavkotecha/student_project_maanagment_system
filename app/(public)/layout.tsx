import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';
import theme from "../theme/themeConfig";
import "../globals.css";

export const metadata: Metadata = {
  title: "SPMS - Student Project Management System",
  description: "A comprehensive platform for managing student academic projects, team collaboration, and progress tracking.",
  keywords: ["student", "project", "management", "academic", "education", "university"],
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>
        <AntdApp>
          {children}
        </AntdApp>
      </ConfigProvider>
    </AntdRegistry>
  );
}
