import { useMemo, useState } from 'react';
import {
  Check,
  MapPin,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';
import { computeCompatibilityScore, formatINR, METRO_CITIES } from '../data/habitationData';
import type {
  FlatmateProfile,
  LifestyleVector,
  MetroCity,
} from '../types/habitation';
import { SafeImage } from './SafeImage';

interface FlatmatesScreenProps {
  flatmates: FlatmateProfile[];
  userLifestyle: LifestyleVector;
  onUpdateLifestyle: (next: LifestyleVector) => void;
  connectedIds: string[];
  onToggleConnect: (mateId: string) => void;
  onMessageFlatmate: (mate: FlatmateProfile) => void;
}

type HabitFilter =
  | 'All'
  | '90%+ Match'
  | 'Vegetarian'
  | 'Non-Smoker'
  | 'Early Bird'
  | 'WFH Hybrid'
  | 'Pet Friendly';

const HABIT_FILTERS: HabitFilter[] = [
  'All',
  '90%+ Match',
  'Vegetarian',
  'Non-Smoker',
  'Early Bird',
  'WFH Hybrid',
  'Pet Friendly',
];

export function FlatmatesScreen({
  flatmates,
  userLifestyle,
  onUpdateLifestyle,
  connectedIds,
  onToggleConnect,
  onMessageFlatmate,
}: FlatmatesScreenProps) {
  const [cityFilter, setCityFilter] = useState<MetroCity>('All Cities');
  const [habitFilter, setHabitFilter] = useState<HabitFilter>('All');
  const [showPrefsEditor, setShowPrefsEditor] = useState(false);

  const scoredFlatmates = useMemo(() => {
    return flatmates
      .map((mate) => ({
        ...mate,
        matchScore: computeCompatibilityScore(userLifestyle, mate.lifestyle),
      }))
      .filter((mate) => {
        if (cityFilter !== 'All Cities' && mate.city !== cityFilter) {
          return false;
        }
        if (habitFilter === '90%+ Match' && mate.matchScore < 90) {
          return false;
        }
        if (
          habitFilter === 'Vegetarian' &&
          mate.lifestyle.diet !== 'Vegetarian'
        ) {
          return false;
        }
        if (
          habitFilter === 'Non-Smoker' &&
          mate.lifestyle.smoking !== 'Non-Smoker'
        ) {
          return false;
        }
        if (
          habitFilter === 'Early Bird' &&
          mate.lifestyle.sleepSchedule !== 'Early Bird'
        ) {
          return false;
        }
        if (
          habitFilter === 'WFH Hybrid' &&
          mate.lifestyle.workSetup !== 'WFH Hybrid'
        ) {
          return false;
        }
        if (habitFilter === 'Pet Friendly' && !mate.lifestyle.petFriendly) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [flatmates, userLifestyle, cityFilter, habitFilter]);

  return (
    <section aria-label="Compatible Flatmate Directory">
      {/* Header & Interactive Match Preference Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold leading-[34px] md:leading-[40px] tracking-[-0.02em] text-[#0F172A]">
            Compatible flatmates near you
          </h1>
          <p className="mt-1.5 text-sm md:text-base text-[#334155]">
            Matched on sleep rhythm, kitchen diet, WFH hours, and Aadhaar verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPrefsEditor((v) => !v)}
          aria-expanded={showPrefsEditor}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#0F766E]" />
          <span>
            {showPrefsEditor ? 'Close Match Preferences' : 'Tune Match Preferences'}
          </span>
        </button>
      </div>

      {/* Expandable Lifestyle Match Tuner */}
      {showPrefsEditor && (
        <div className="card-level-1 mb-6 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Your Household Habits
              </h2>
              <p className="text-xs text-[#475569]">
                Match percentages below update immediately when you adjust your preferences.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold text-[#334155]">
                Sleep Schedule
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(['Early Bird', 'Balanced', 'Night Owl'] as const).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onUpdateLifestyle({
                          ...userLifestyle,
                          sleepSchedule: opt,
                        })
                      }
                      className={`min-h-[36px] rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                        userLifestyle.sleepSchedule === opt
                          ? 'bg-[#0F766E] text-white'
                          : 'border border-[#E2E8F0] bg-white text-[#334155]'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#334155]">
                Kitchen Diet
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(['Vegetarian', 'Eggetarian', 'Flexible'] as const).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onUpdateLifestyle({ ...userLifestyle, diet: opt })
                      }
                      className={`min-h-[36px] rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                        userLifestyle.diet === opt
                          ? 'bg-[#0F766E] text-white'
                          : 'border border-[#E2E8F0] bg-white text-[#334155]'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#334155]">Work Setup</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(['WFH Hybrid', 'Office Daily', 'Remote'] as const).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onUpdateLifestyle({ ...userLifestyle, workSetup: opt })
                      }
                      className={`min-h-[36px] rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                        userLifestyle.workSetup === opt
                          ? 'bg-[#0F766E] text-white'
                          : 'border border-[#E2E8F0] bg-white text-[#334155]'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#334155]">
                Pet &amp; Smoking
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateLifestyle({
                      ...userLifestyle,
                      petFriendly: !userLifestyle.petFriendly,
                    })
                  }
                  className={`min-h-[36px] rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                    userLifestyle.petFriendly
                      ? 'bg-[#0F766E] text-white'
                      : 'border border-[#E2E8F0] bg-white text-[#334155]'
                  }`}
                >
                  Pet Friendly: {userLifestyle.petFriendly ? 'Yes' : 'No'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateLifestyle({
                      ...userLifestyle,
                      smoking:
                        userLifestyle.smoking === 'Non-Smoker'
                          ? 'Outdoor Only'
                          : 'Non-Smoker',
                    })
                  }
                  className={`min-h-[36px] rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                    userLifestyle.smoking === 'Non-Smoker'
                      ? 'bg-[#0F766E] text-white'
                      : 'border border-[#E2E8F0] bg-white text-[#334155]'
                  }`}
                >
                  {userLifestyle.smoking}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* City & Habit Filter Strips */}
      <div className="mb-5 space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {METRO_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setCityFilter(city)}
              className={`min-h-[44px] sm:min-h-[38px] rounded-full px-4 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                cityFilter === city
                  ? 'bg-[#0F766E] border border-[#0F766E] text-white'
                  : 'bg-white border border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {HABIT_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setHabitFilter(filter)}
              className={`min-h-[44px] sm:min-h-[36px] rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                habitFilter === filter
                  ? 'bg-[#0F766E]/10 border border-[#0F766E] text-[#0F766E]'
                  : 'bg-white border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {scoredFlatmates.length === 0 ? (
        <div className="card-level-1 rounded-2xl p-8 text-center">
          <p className="text-base font-semibold text-[#0F172A]">
            No flatmate profiles match this filter combination
          </p>
          <button
            type="button"
            onClick={() => {
              setCityFilter('All Cities');
              setHabitFilter('All');
            }}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white"
          >
            Reset Flatmate Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scoredFlatmates.map((mate) => {
            const isConnected = connectedIds.includes(mate.id);
            return (
              <article
                key={mate.id}
                className="card-level-1 flex flex-col rounded-2xl p-5"
              >
                {/* Compatibility Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold tabular-nums text-white">
                    {mate.matchScore}% Lifestyle Match
                  </span>
                  {mate.govtIdVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/12 px-2.5 py-1 text-[11px] font-bold text-[#047857]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>Govt ID</span>
                    </span>
                  )}
                </div>

                {/* Portrait & Identity */}
                <div className="mt-4 flex items-center gap-3.5">
                  <SafeImage
                    src={mate.avatar}
                    alt={`${mate.name}, ${mate.role}`}
                    className="h-16 w-16 rounded-2xl object-cover shrink-0 border border-[#E2E8F0]"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-[#0F172A]">
                      {mate.name}, {mate.age}
                    </h2>
                    <p className="truncate text-xs font-semibold text-[#334155]">
                      {mate.role}
                    </p>
                    <p className="truncate text-xs text-[#64748B]">
                      {mate.companyOrCampus}
                    </p>
                  </div>
                </div>

                {/* Budget & Localities */}
                <div className="mt-4 space-y-1.5 border-y border-[#F1F5F9] py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#475569]">Monthly Budget</span>
                    <span className="font-bold tabular-nums text-[#0F172A]">
                      {formatINR(mate.budgetMin)} – {formatINR(mate.budgetMax)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#475569] shrink-0">Preferred</span>
                    <span className="truncate font-semibold text-[#0F766E] flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {mate.preferredLocalities.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#475569]">Move-In</span>
                    <span className="font-semibold text-[#0F172A]">
                      {mate.moveInDate}
                      {mate.policeCleared ? ' · Police Cleared' : ''}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#334155]">
                  {mate.bio}
                </p>

                {/* Unboxed lifestyle habits */}
                <p className="mt-3 text-xs font-medium text-[#475569]">
                  {mate.habits.join(' · ')}
                </p>

                {/* Primary & Secondary Action Buttons */}
                <div className="mt-auto pt-4 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onMessageFlatmate(mate)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0F766E]/10 px-3 text-xs font-semibold text-[#0F766E] hover:bg-[#0F766E]/15 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleConnect(mate.id)}
                    className={`inline-flex min-h-[44px] flex-[1.2] items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-transform active:scale-[0.98] ${
                      isConnected
                        ? 'bg-[#10B981]/12 text-[#047857]'
                        : 'bg-[#F97316] text-white hover:bg-[#EA580C]'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
