import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Tag, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  MessageSquare, 
  PlusCircle, 
  AlertTriangle, 
  Sliders, 
  FileText,
  Search,
  Share2,
  MessageCircle,
  Wand2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({
  activePortal,
  activeRoute,
  setActiveRoute,
  unreadDisputesCount = 0,
  pendingReviewCount = 0,
  unreadMessagesCount = 0
}) {
  const routesByPortal = {
    creator: [
      { id: 'directory', label: 'Public directory', icon: Users },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'messages', label: 'Gig chat & inbox', icon: MessageCircle, badge: unreadMessagesCount },
      { id: 'connectors', label: 'Connectors', icon: Share2 },
      { id: 'rate-cards', label: 'Rate cards', icon: Tag },
      { id: 'opportunities', label: 'Campaign board', icon: Briefcase },
      { id: 'contracts', label: 'Escrow contracts', icon: ShieldCheck },
      { id: 'audit', label: 'AI channel audit', icon: Sparkles },
      { id: 'credits', label: 'Credits & ledger', icon: Coins }
    ],
    brand: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'content-creator', label: 'AI Content Creator', icon: Wand2, badge: 'NEW' },
      { id: 'campaigns', label: 'My campaigns', icon: Briefcase },
      { id: 'messages', label: 'Creator chat & inbox', icon: MessageCircle, badge: unreadMessagesCount },
      { id: 'new-campaign', label: 'New campaign (AI)', icon: PlusCircle },
      { id: 'creators', label: 'Creator directory', icon: Search },
      { id: 'contracts', label: 'Escrow contracts', icon: ShieldCheck },
      { id: 'advisor', label: 'NefraSense advisor', icon: MessageSquare },
      { id: 'credits', label: 'Brand wallet & credits', icon: Coins }
    ],
    admin: [
      { id: 'overview', label: 'Platform overview', icon: LayoutDashboard },
      { id: 'creators', label: 'Creator review queue', icon: Users, badge: pendingReviewCount },
      { id: 'disputes', label: 'Dispute center', icon: AlertTriangle, badge: unreadDisputesCount },
      { id: 'contracts', label: 'All contracts', icon: ShieldCheck },
      { id: 'config', label: 'Platform config', icon: Sliders },
      { id: 'audit-log', label: 'Audit log', icon: FileText }
    ]
  };

  const currentRoutes = routesByPortal[activePortal] || [];

  return (
    <aside className="w-56 shrink-0 border-r border-[#27272a] bg-[#000000] min-h-[calc(100vh-3.5rem)] p-3 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-semibold text-[#52525b] tracking-wider">
          {activePortal} Navigation
        </div>
        {currentRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = activeRoute === route.id;
          return (
            <button
              key={route.id}
              onClick={() => setActiveRoute(route.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-[#18181b] text-[#fafafa] border-l-2 border-[#e11d48]"
                  : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50"
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon size={16} className={isActive ? "text-[#e11d48]" : "text-[#71717a]"} />
                <span>{route.label}</span>
              </div>
              {Boolean(route.badge) && (
                <span className="bg-[#e11d48] text-white text-[10px] px-1.5 py-0.2 rounded-full font-semibold">
                  {route.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#09090b] rounded-lg border border-[#27272a] text-[11px] text-[#71717a]">
        <p className="font-semibold text-[#fafafa] text-xs">Nefra v2.0</p>
        <p className="mt-0.5">Escrow-backed creator economy engine.</p>
      </div>
    </aside>
  );
}
