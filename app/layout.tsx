import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';
import SessionProvider from "./providers/SessionProvider";
import QueryProvider from "./providers/QueryProvider";
import theme from "./theme/themeConfig";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPMS - Student Project Management System",
  description: "Comprehensive project management system for academic institutions",
  keywords: ["student", "project", "management", "academic", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <AntdRegistry>
              <ConfigProvider theme={theme}>
                <AntdApp>
                  {children}
                </AntdApp>
              </ConfigProvider>
            </AntdRegistry>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
