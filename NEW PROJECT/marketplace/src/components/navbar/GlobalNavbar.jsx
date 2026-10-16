import React from 'react';
import { Button, Tag, Badge, Tooltip, Avatar, Space } from 'antd';
import {
  SwapOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  BellOutlined,
  WalletOutlined,
  YoutubeOutlined,
  ThunderboltFilled,
  UserOutlined
} from '@ant-design/icons';

export default function GlobalNavbar({
  mode,
  setMode,
  activeTab,
  setActiveTab,
  creator,
  onOpenOnboarding
}) {
  const isCreator = mode === 'creator';

  const creatorTabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'rate-card', label: 'Rate Card & Gigs', icon: '💎' },
    { key: 'jobs', label: 'Brand Jobs & Bids', icon: '🎯' },
    { key: 'escrow', label: 'Escrow Deals', icon: '🔒' },
    { key: 'ai-audit', label: 'AI Diagnostics', icon: '⚡' },
    { key: 'directory', label: 'Top 10 Directory', icon: '🌐' }
  ];

  const businessTabs = [
    { key: 'brand-discover', label: 'Discover Creators', icon: '🔍' },
    { key: 'brand-campaigns', label: 'Campaign Builder', icon: '🚀' },
    { key: 'brand-escrow', label: 'Hires & Escrow', icon: '💼' }
  ];

  const currentTabs = isCreator ? creatorTabs : businessTabs;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <ThunderboltFilled className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                  NEFRA
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  CREATORS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Escrow & Creator Economy
              </p>
            </div>
          </div>

          {/* Fiverr-Style Switcher & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* ESCROW BALANCE INDICATOR */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <WalletOutlined className="text-emerald-400 text-sm" />
              <span>Escrow Vault:</span>
              <span className="font-semibold text-emerald-400 font-mono">
                ${creator?.metrics?.escrowLocked?.toLocaleString() || '12,450'}
              </span>
            </div>

            {/* FIVERR STYLE TOGGLE BUTTON */}
            <Tooltip
              title={
                isCreator
                  ? "Switch to Brand / Buyer Mode to hire creators & post campaigns"
                  : "Switch to Creator / Seller Mode to manage your rate card & gigs"
              }
            >
              <button
                onClick={() => {
                  const newMode = isCreator ? 'business' : 'creator';
                  setMode(newMode);
                  setActiveTab(newMode === 'creator' ? 'dashboard' : 'brand-discover');
                }}
                className={`relative group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-md ${
                  isCreator
                    ? 'bg-gradient-to-r from-emerald-600/90 to-teal-500/90 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20 border border-emerald-400/30'
                    : 'bg-gradient-to-r from-indigo-600/90 to-cyan-500/90 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-500/20 border border-indigo-400/30'
                }`}
              >
                <SwapOutlined className="text-sm transition-transform duration-300 group-hover:rotate-180" />
                <span className="tracking-wide">
                  {isCreator ? 'Switch to Business (Buying)' : 'Switch to Creator Hub (Selling)'}
                </span>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </button>
            </Tooltip>

            {/* ONBOARDING FLOW TRIGGER */}
            <Tooltip title="Relaunch Creator Onboarding Wizard">
              <Button
                size="small"
                onClick={onOpenOnboarding}
                className="bg-indigo-950/60 border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-900/60 text-xs hidden sm:flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>Onboarding</span>
              </Button>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="3 Notifications">
              <Badge count={3} size="small" offset={[-2, 4]} color="#6366f1">
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined className="text-slate-300 text-base" />}
                  className="hover:bg-slate-800 border-none"
                />
              </Badge>
            </Tooltip>

            {/* Creator / User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Avatar
                src={creator?.avatar}
                icon={<UserOutlined />}
                size="large"
                className="border-2 border-indigo-500/40"
              />
              <div className="hidden lg:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    {creator?.name || 'Kaveen Tech'}
                  </span>
                  <CheckCircleFilled className="text-blue-400 text-[11px]" />
                </div>
                <span className="text-[10px] text-indigo-400 font-medium">
                  {isCreator ? 'Verified Partner' : 'Enterprise Brand'}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/60 overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-1 sm:gap-2">
            {currentTabs.map(tab => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Status Pill */}
          <div className="hidden md:flex items-center gap-2 pl-4 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Mode:{' '}
              <strong className="text-slate-200">
                {isCreator ? 'Creator Hub' : 'Brand Client'}
              </strong>
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
