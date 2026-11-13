import { Plus } from 'lucide-react';
import type { AppTab } from '../types/habitation';

interface TopNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenListRoom: () => void;
  savedCount: number;
  visitCount: number;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'flatmates', label: 'Flatmates' },
  { id: 'saved', label: 'Saved' },
  { id: 'visits', label: 'Visits & KYC' },
];

export function TopNav({
  activeTab,
  onSelectTab,
  onOpenListRoom,
  savedCount,
  visitCount,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-8 px-4 md:px-6">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className="flex items-center gap-2 text-left text-xl font-bold tracking-[-0.02em] text-[#0F172A] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-lg px-1 py-1"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F766E] text-sm font-bold text-white"
          >
            N
          </span>
          <span>Nivas</span>
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const countSuffix =
              item.id === 'saved' && savedCount > 0
                ? ` (${savedCount})`
                : item.id === 'visits' && visitCount > 0
                  ? ` (${visitCount})`
                  : '';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative min-h-[44px] px-1 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-md ${
                  isActive
                    ? 'text-[#0F766E]'
                    : 'text-[#334155] hover:text-[#0F172A]'
                }`}
              >
                {item.label}
                {countSuffix && (
                  <span className="ml-1 text-xs font-semibold tabular-nums text-[#64748B]">
                    {countSuffix}
                  </span>
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[11px] h-0.5 bg-[#0F766E] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenListRoom}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#F97316] px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#EA580C] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            <span>List a Room</span>
          </button>
        </div>
      </div>
    </header>
  );
}
