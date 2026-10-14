'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Notification } from '@/types';
import { 
  ArrowLeftRight,
  Bell, 
  LogOut, 
  Plus
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPostProject: () => void;
}

export default function Navbar({ onOpenAuth, activeTab, setActiveTab, onOpenPostProject }: NavbarProps) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await api.notifications.getAll();
      setNotifications(data);
      const count = await api.notifications.getUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6ddce] bg-[#faf7f2]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#b45309] text-white flex items-center justify-center shadow-xs">
              <ArrowLeftRight className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#221814]">
                  Frndly<span className="text-[#b45309]">Saathi</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                  Tasks &amp; Barter
                </span>
              </div>
              <p className="text-[10px] text-[#6e5e54] hidden sm:block">Parallel Marketplace &amp; Mutual Skill Swaps</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f7f2eb] p-1 rounded-xl border border-[#e6ddce]">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                  : 'text-[#6e5e54] hover:text-[#221814] hover:bg-white/60'
              }`}
            >
              Parallel Hub
            </button>
            {user && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-white/60'
                  }`}
                >
                  My Workspace
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'contracts'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-white/60'
                  }`}
                >
                  Contracts &amp; Escrow
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Quick Post Task Button */}
              <button
                onClick={onOpenPostProject}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#b45309] hover:bg-[#92400e] text-white shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Task</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-white hover:bg-[#ede4d8] text-[#6e5e54] hover:text-[#221814] transition-colors border border-[#e6ddce]"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white p-4 shadow-xl border border-[#e6ddce] z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce] mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#221814]">Notifications</span>
                        <span className="text-[10px] bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} new
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-[#b45309] hover:text-[#92400e] font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-[#a89a8e] text-xs">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-xl border transition-colors ${
                              n.read
                                ? 'bg-[#faf7f2] border-[#e6ddce] text-[#6e5e54]'
                                : 'bg-[#fffbeb] border-[#fde68a] text-[#221814]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-[#221814]">{n.title}</span>
                              <span className="text-[10px] text-[#6e5e54] font-mono">
                                {n.type}
                              </span>
                            </div>
                            <p className="text-xs text-[#6e5e54] line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-3 pl-2 border-l border-[#e6ddce]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#fef3c7] text-[#92400e] border border-[#fde68a] flex items-center justify-center text-xs font-bold shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-[#221814] leading-tight">{user.name}</div>
                    <div className="text-[10px] text-[#6e5e54] font-medium">
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-[#faf7f2] hover:bg-red-50 text-[#6e5e54] hover:text-red-700 border border-[#e6ddce] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#221814] hover:text-[#b45309] bg-white hover:bg-[#faf7f2] border border-[#e6ddce] shadow-xs transition-all"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#b45309] hover:bg-[#92400e] text-white shadow-xs transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
