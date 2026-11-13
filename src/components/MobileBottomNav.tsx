import { Bookmark, CalendarCheck, Compass, Users } from 'lucide-react';
import type { AppTab } from '../types/habitation';

interface MobileBottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  savedCount: number;
  visitCount: number;
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  savedCount,
  visitCount,
}: MobileBottomNavProps) {
  const tabs: {
    id: AppTab;
    label: string;
    icon: typeof Compass;
    badge?: number;
  }[] = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'flatmates', label: 'Flatmates', icon: Users },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
    { id: 'visits', label: 'Visits', icon: CalendarCheck, badge: visitCount },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E2E8F0] bg-white/95 backdrop-blur-md md:hidden"
    >
      <div className="grid h-16 grid-cols-4 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex min-h-[44px] flex-col items-center justify-center rounded-xl py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
                isActive ? 'text-[#0F766E]' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 text-[10px] font-bold tabular-nums text-[#F97316]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[11px] leading-none tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-[#0F766E]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
