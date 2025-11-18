// src/components/layout/AppShell.tsx
import React, { useState, FormEvent } from "react";
import { Topbar } from "./Topbar";

export interface AppShellProps {
  children: React.ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function AppShell({ children }: AppShellProps) {
  // 🔍 جست‌وجو
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // 🔔 اعلان‌ها
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "پرونده جدید به شما اختصاص یافت",
      description: "UTN-2045 برای بررسی مدارک به شما ارجاع شده است.",
      time: "۱۰ دقیقه پیش",
      read: false,
    },
    {
      id: "n2",
      title: "به‌روزرسانی وضعیت پرداخت",
      description: "پرداخت فاکتور INV-2045 تایید شد.",
      time: "۱ ساعت پیش",
      read: false,
    },
    {
      id: "n3",
      title: "یادآوری جلسه",
      description: "جلسه هماهنگی طراحی فردا ساعت ۱۰:۳۰ برگزار می‌شود.",
      time: "دیروز",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSubmitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchSubmitted(true);

    // 👇 اینجا بعداً می‌تونی به API واقعی وصل شوی
    // فعلاً فقط پیام راهنما نشان داده می‌شود
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-right" dir="rtl" lang="fa">
      {/* هدر بالا با آیکن جست‌وجو و اعلان‌ها */}
      <Topbar
        onSearchClick={() => {
          setIsSearchOpen((prev) => !prev);
          setSearchSubmitted(false);
        }}
        onNotificationsClick={() => setIsNotifOpen((prev) => !prev)}
        unreadNotifications={unreadCount}
      />

      {/* نوار جست‌وجوی بازشونده زیر هدر */}
      {isSearchOpen && (
        <div className="border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm px-6 py-3">
          <form
            onSubmit={handleSubmitSearch}
            className="max-w-xl ml-auto flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchSubmitted(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white pr-3 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-right"
                placeholder="جست‌وجوی پرونده، کشتی یا UTN..."
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800"
            >
              اجرای جست‌وجو
            </button>
          </form>
          {searchSubmitted && (
            <p className="max-w-xl ml-auto mt-2 text-[11px] text-slate-500 text-right">
              نتایج جست‌وجو برای{" "}
              <span className="font-semibold">«{searchQuery}»</span> فعلاً
              نمایشی است و بعداً می‌توان آن را به API واقعی متصل کرد.
            </p>
          )}
        </div>
      )}

      {/* پنل اعلان‌ها (در گوشه بالا-چپ صفحه مثل یک منوی دراپ‌داون) */}
      {isNotifOpen && (
        <div className="fixed top-16 left-6 z-40 w-80 rounded-2xl bg-white shadow-xl border border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-900">
              اعلان‌ها
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-blue-600 hover:text-blue-800"
              >
                علامت‌گذاری همه به عنوان خوانده شده
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                اعلان فعالی وجود ندارد.
              </div>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleMarkNotificationRead(n.id)}
                className={`w-full text-right px-4 py-3 flex flex-col items-start gap-0.5 hover:bg-slate-50 ${
                  !n.read ? "bg-amber-50/40" : ""
                }`}
              >
                <span className="text-xs font-semibold text-slate-900">
                  {n.title}
                </span>
                <span className="text-[11px] text-slate-600">
                  {n.description}
                </span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* محتوای اصلی صفحات داشبورد */}
      <main className="px-6 py-8 lg:px-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
