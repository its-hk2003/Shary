import { useMemo, useState } from 'react';
import {
  Bookmark,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrainFront,
} from 'lucide-react';
import { formatINR, METRO_CITIES } from '../data/habitationData';
import type { FlatListing, MetroCity } from '../types/habitation';
import { SafeImage } from './SafeImage';

interface DiscoverScreenProps {
  flats: FlatListing[];
  savedFlatIds: string[];
  onToggleSave: (flatId: string) => void;
  onSelectFlat: (flat: FlatListing) => void;
}

type QuickFilter =
  | 'All'
  | 'Private Room'
  | 'Master Suite'
  | 'Metro < 1km'
  | 'Cook Available'
  | 'AC Included';

type SortOption = 'recommended' | 'rent-asc' | 'metro-asc';

const QUICK_FILTERS: QuickFilter[] = [
  'All',
  'Private Room',
  'Master Suite',
  'Metro < 1km',
  'Cook Available',
  'AC Included',
];

export function DiscoverScreen({
  flats,
  savedFlatIds,
  onToggleSave,
  onSelectFlat,
}: DiscoverScreenProps) {
  const [selectedCity, setSelectedCity] = useState<MetroCity>('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  const filteredFlats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = flats.filter((flat) => {
      if (selectedCity !== 'All Cities' && flat.city !== selectedCity) {
        return false;
      }
      if (q) {
        const hay = `${flat.title} ${flat.locality} ${flat.city} ${flat.nearestMetro} ${flat.techParkProximity}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (quickFilter === 'Private Room' && flat.roomType !== 'Private Room') {
        return false;
      }
      if (quickFilter === 'Master Suite' && flat.roomType !== 'Master Suite') {
        return false;
      }
      if (quickFilter === 'Metro < 1km' && flat.metroDistanceMeters > 1000) {
        return false;
      }
      if (quickFilter === 'Cook Available' && !flat.cookAvailable) {
        return false;
      }
      if (quickFilter === 'AC Included' && !flat.acIncluded) {
        return false;
      }
      return true;
    });

    if (sortBy === 'rent-asc') {
      return [...list].sort((a, b) => a.monthlyRent - b.monthlyRent);
    }
    if (sortBy === 'metro-asc') {
      return [...list].sort(
        (a, b) => a.metroDistanceMeters - b.metroDistanceMeters
      );
    }
    return list;
  }, [flats, selectedCity, searchQuery, quickFilter, sortBy]);

  return (
    <section aria-label="Discover verified metro flatshares">
      {/* Compact Search & Metro Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[26px] md:text-[32px] font-bold leading-[34px] md:leading-[40px] tracking-[-0.02em] text-[#0F172A]">
              Verified metro flatshares, zero brokerage
            </h1>
            <p className="mt-1.5 text-sm md:text-base text-[#334155]">
              Aadhaar-vetted flatmates and escrow-protected deposits near rapid transit.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#047857] shrink-0">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            <span>Every listing is Govt ID &amp; Escrow checked</span>
          </div>
        </div>

        {/* Search Input + Sort Row */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
              strokeWidth={2}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indiranagar, Bandra West, metro station, or tech park..."
              aria-label="Search flats by locality, metro station, or tech park"
              className="input-nivas w-full pl-10 pr-4 text-sm placeholder:text-[#64748B]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-[#475569] hidden sm:block" />
            <label htmlFor="flat-sort" className="sr-only">
              Sort listings
            </label>
            <select
              id="flat-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-nivas px-3.5 text-sm font-medium text-[#0F172A] min-h-[48px] w-full sm:w-auto"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rent-asc">Rent: Low to High</option>
              <option value="metro-asc">Closest to Metro</option>
            </select>
          </div>
        </div>

        {/* City Selector Pills */}
        <div
          className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
          role="group"
          aria-label="Filter by metro city"
        >
          {METRO_CITIES.map((city) => {
            const active = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`min-h-[44px] sm:min-h-[38px] rounded-full px-4 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
                  active
                    ? 'bg-[#0F766E] border border-[#0F766E] text-white'
                    : 'bg-white border border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Quick Habit / Amenity Filter Controls */}
        <div
          className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
          role="group"
          aria-label="Quick property filters"
        >
          {QUICK_FILTERS.map((filter) => {
            const active = quickFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setQuickFilter(filter)}
                className={`min-h-[44px] sm:min-h-[36px] rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
                  active
                    ? 'bg-[#0F766E]/10 border border-[#0F766E] text-[#0F766E]'
                    : 'bg-white border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-[#475569]">
        <span className="tabular-nums">
          Showing {filteredFlats.length} verified{' '}
          {filteredFlats.length === 1 ? 'room' : 'rooms'}
          {selectedCity !== 'All Cities' ? ` in ${selectedCity}` : ''}
        </span>
        {(selectedCity !== 'All Cities' ||
          quickFilter !== 'All' ||
          searchQuery.trim() !== '') && (
          <button
            type="button"
            onClick={() => {
              setSelectedCity('All Cities');
              setQuickFilter('All');
              setSearchQuery('');
            }}
            className="min-h-[36px] px-2 font-semibold text-[#0F766E] hover:underline whitespace-nowrap"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Listing Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      {filteredFlats.length === 0 ? (
        <div className="card-level-1 rounded-2xl p-8 text-center">
          <p className="text-base font-semibold text-[#0F172A]">
            No verified rooms match those exact filters
          </p>
          <p className="mt-1 text-sm text-[#475569]">
            Try clearing one of your filters or switching to All Cities.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCity('All Cities');
              setQuickFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white hover:bg-[#005C55]"
          >
            Show All Verified Flats
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFlats.map((flat) => {
            const isSaved = savedFlatIds.includes(flat.id);
            const metroText =
              flat.metroDistanceMeters < 1000
                ? `${flat.metroDistanceMeters}m to ${flat.nearestMetro}`
                : `${(flat.metroDistanceMeters / 1000).toFixed(1)}km to ${flat.nearestMetro}`;

            return (
              <article
                key={flat.id}
                className="card-level-1 group flex flex-col overflow-hidden rounded-2xl transition-transform duration-150 hover:-translate-y-0.5"
              >
                {/* 16:10 Image Gallery Top */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => onSelectFlat(flat)}
                    className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F766E]"
                    aria-label={`View details for ${flat.title} in ${flat.locality}`}
                  >
                    <SafeImage
                      src={flat.images[0]}
                      alt={`${flat.title} in ${flat.locality}, ${flat.city}`}
                      fallbackLabel={flat.locality}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {/* Measured contrast scrim at bottom */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
                    />
                  </button>

                  {/* Corner Rent Overlay */}
                  <div className="pointer-events-none absolute bottom-3 left-3.5 text-white">
                    <span className="text-lg font-bold tracking-tight tabular-nums">
                      {formatINR(flat.monthlyRent)}
                    </span>
                    <span className="text-xs font-medium text-white/90">
                      /mo
                    </span>
                  </div>

                  {/* Available Move-In Text Overlay */}
                  <div className="pointer-events-none absolute bottom-3.5 right-3.5 text-xs font-semibold text-white/95">
                    Move-in {flat.availableFrom}
                  </div>

                  {/* Top-right 44x44px Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => onToggleSave(flat.id)}
                    aria-label={
                      isSaved
                        ? `Remove ${flat.title} from saved`
                        : `Save ${flat.title}`
                    }
                    aria-pressed={isSaved}
                    className="absolute right-2.5 top-2.5 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/95 text-[#0F172A] shadow-sm backdrop-blur-sm transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                  >
                    <Bookmark
                      className={`h-5 w-5 ${
                        isSaved
                          ? 'fill-[#F97316] text-[#F97316]'
                          : 'text-[#334155]'
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4">
                  <button
                    type="button"
                    onClick={() => onSelectFlat(flat)}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-md"
                  >
                    <h2 className="text-base font-bold leading-[22px] text-[#0F172A] group-hover:text-[#0F766E] transition-colors">
                      {flat.title}
                    </h2>
                  </button>

                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#334155]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                    <span className="truncate">
                      {flat.locality}, {flat.city}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#475569] tabular-nums">
                    <TrainFront className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                    <span className="truncate">{metroText}</span>
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <p className="mt-3 text-xs font-medium text-[#475569] leading-relaxed">
                    {flat.preferences.join(' · ')}
                  </p>

                  {/* Footer: Poster Avatar + Govt ID Verification */}
                  <div className="mt-auto pt-3.5">
                    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SafeImage
                          src={flat.poster.avatar}
                          alt={flat.poster.name}
                          className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#0F172A]">
                            {flat.poster.name}
                          </p>
                          <p className="truncate text-[11px] font-semibold text-[#047857] flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-[#10B981] shrink-0" />
                            <span>Govt ID Verified</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectFlat(flat)}
                        className="min-h-[40px] rounded-lg bg-[#0F766E]/10 px-3 text-xs font-semibold text-[#0F766E] hover:bg-[#0F766E]/15 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                      >
                        View Flat
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
