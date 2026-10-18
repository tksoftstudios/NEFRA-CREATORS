import React from 'react';
import { 
  ChevronRight, 
  Home, 
  Building2, 
  User, 
  ShieldCheck, 
  Briefcase, 
  PlusCircle, 
  Users, 
  MessageSquare, 
  Wallet, 
  BarChart3, 
  Wand2, 
  Sparkles, 
  Tag, 
  Flame, 
  Radio, 
  Scale, 
  UserCheck, 
  Sliders, 
  Settings,
  LayoutDashboard,
  Compass,
  X
} from 'lucide-react';

const ROUTE_CONFIG = {
  // Brand routes
  'dashboard': { label: 'Dashboard', icon: LayoutDashboard },
  'content-creator': { label: 'AI Content Creator', icon: Wand2 },
  'messages': { label: 'Gig Chat & Offers', icon: MessageSquare },
  'campaigns': { label: 'Campaigns & Gigs', icon: Briefcase },
  'new-campaign': { 
    label: 'New AI Campaign', 
    icon: PlusCircle,
    parent: { route: 'campaigns', label: 'Campaigns & Gigs' } 
  },
  'creators': { label: 'Creator Matchmaker', icon: Users },
  'contracts': { label: 'Escrow Vaults', icon: ShieldCheck },
  'advisor': { label: 'NefraSense Strategic Advisor', icon: Sparkles },
  'credits': { label: 'Wallet & Credits', icon: Wallet },

  // Creator routes
  'directory': { label: 'Talent Directory', icon: Compass },
  'connectors': { label: 'Platform Connectors', icon: Radio },
  'rate-cards': { label: 'Rate Cards', icon: Tag },
  'opportunities': { label: 'Opportunities Board', icon: Flame },
  'audit': { label: 'Channel Diagnostics', icon: BarChart3 },

  // Admin routes
  'overview': { label: 'Platform Financials', icon: LayoutDashboard },
  'disputes': { label: 'Escrow Arbitration', icon: Scale },
  'creators-review': { label: 'Creator Verification', icon: UserCheck },
  'platform-config': { label: 'Protocol Settings', icon: Sliders },
  'settings': { label: 'System Environment', icon: Settings },
};

const PORTAL_CONFIG = {
  creator: {
    label: 'Creator Studio',
    icon: User,
    defaultRoute: 'dashboard',
    badgeClass: 'text-[#e11d48] bg-[#e11d48]/10 border-[#e11d48]/30',
    accentColor: 'text-[#e11d48]'
  },
  brand: {
    label: 'Brand Workspace',
    icon: Building2,
    defaultRoute: 'dashboard',
    badgeClass: 'text-[#1ed760] bg-[#1db954]/10 border-[#1db954]/30',
    accentColor: 'text-[#1ed760]'
  },
  admin: {
    label: 'Platform Governance',
    icon: ShieldCheck,
    defaultRoute: 'overview',
    badgeClass: 'text-[#38bdf8] bg-[#0284c7]/10 border-[#0284c7]/30',
    accentColor: 'text-[#38bdf8]'
  }
};

export function BreadcrumbNav({
  activePortal = 'brand',
  activeRoute = 'dashboard',
  onNavigate,
  inspectedCreator = null,
  onClearInspectedCreator = null,
  className = ''
}) {
  const portal = PORTAL_CONFIG[activePortal] || PORTAL_CONFIG.creator;
  const routeInfo = ROUTE_CONFIG[activeRoute] || { label: activeRoute, icon: Home };

  const crumbs = [];

  // 1. Root: Portal Home
  crumbs.push({
    id: 'portal-home',
    label: portal.label,
    icon: portal.icon,
    onClick: () => {
      if (inspectedCreator && onClearInspectedCreator) {
        onClearInspectedCreator();
      }
      if (onNavigate) {
        onNavigate(portal.defaultRoute);
      }
    },
    isRoot: true,
    isCurrent: activeRoute === portal.defaultRoute && !inspectedCreator
  });

  // 2. Parent Route (if any)
  if (routeInfo.parent) {
    crumbs.push({
      id: routeInfo.parent.route,
      label: routeInfo.parent.label,
      icon: ROUTE_CONFIG[routeInfo.parent.route]?.icon || Briefcase,
      onClick: () => {
        if (inspectedCreator && onClearInspectedCreator) {
          onClearInspectedCreator();
        }
        if (onNavigate) {
          onNavigate(routeInfo.parent.route);
        }
      },
      isCurrent: false
    });
  }

  // 3. Current Active Route (if distinct from root home or has parent)
  if (activeRoute !== portal.defaultRoute || routeInfo.parent) {
    crumbs.push({
      id: activeRoute,
      label: routeInfo.label,
      icon: routeInfo.icon,
      onClick: inspectedCreator ? () => {
        if (onClearInspectedCreator) onClearInspectedCreator();
      } : undefined,
      isCurrent: !inspectedCreator
    });
  }

  // 4. Inspected Creator Sub-crumb (modal / deep view)
  if (inspectedCreator) {
    crumbs.push({
      id: 'inspected-creator',
      label: `${inspectedCreator.name} (Channel Audit)`,
      icon: BarChart3,
      isCurrent: true,
      onClear: onClearInspectedCreator
    });
  }

  return (
    <nav 
      aria-label="Breadcrumb"
      className={`w-full py-2.5 px-4 sm:px-6 lg:px-8 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between gap-3 text-xs z-20 ${className}`}
    >
      {/* Crumbs Sequence */}
      <ol className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const CrumbIcon = crumb.icon;

          return (
            <li key={crumb.id || idx} className="flex items-center space-x-2 shrink-0">
              {idx > 0 && (
                <ChevronRight size={13} className="text-[#52525b] shrink-0" aria-hidden="true" />
              )}

              {isLast ? (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#18181b] border border-[#27272a] text-[#fafafa] font-semibold"
                  aria-current="page"
                >
                  {CrumbIcon && <CrumbIcon size={13} className={`${portal.accentColor || 'text-[#e11d48]'} shrink-0`} />}
                  <span className="truncate max-w-[200px] sm:max-w-xs">{crumb.label}</span>
                  {crumb.onClear && (
                    <button
                      type="button"
                      onClick={crumb.onClear}
                      className="ml-1 p-0.5 text-[#71717a] hover:text-[#fafafa] rounded transition-colors"
                      title="Close view"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer rounded px-1.5 py-0.5 hover:bg-[#18181b]"
                >
                  {CrumbIcon && <CrumbIcon size={13} className="text-[#71717a] shrink-0" />}
                  <span className="truncate max-w-[150px] sm:max-w-xs">{crumb.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {/* Right Side: Active Workspace Badge */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${portal.badgeClass}`}>
          {portal.label}
        </span>
      </div>
    </nav>
  );
}
