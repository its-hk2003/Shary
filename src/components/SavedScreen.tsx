import { useState } from 'react';
import {
  Bookmark,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { computeCompatibilityScore, formatINR } from '../data/habitationData';
import type {
  FlatListing,
  FlatmateProfile,
  LifestyleVector,
} from '../types/habitation';
import { SafeImage } from './SafeImage';

interface SavedScreenProps {
  savedFlats: FlatListing[];
  connectedFlatmates: FlatmateProfile[];
  userLifestyle: LifestyleVector;
  onRemoveSavedFlat: (flatId: string) => void;
  onOpenFlatDetail: (flat: FlatListing) => void;
  onDisconnectFlatmate: (mateId: string) => void;
  onMessageFlatmate: (mate: FlatmateProfile) => void;
  onGoDiscover: () => void;
}

export function SavedScreen({
  savedFlats,
  connectedFlatmates,
  userLifestyle,
  onRemoveSavedFlat,
  onOpenFlatDetail,
  onDisconnectFlatmate,
  onMessageFlatmate,
  onGoDiscover,
}: SavedScreenProps) {
  const [segment, setSegment] = useState<'flats' | 'mates'>('flats');

  return (
    <section aria-label="Saved Shortlist">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold leading-[34px] md:leading-[40px] tracking-[-0.02em] text-[#0F172A]">
            Your shortlist &amp; connections
          </h1>
          <p className="mt-1.5 text-sm md:text-base text-[#334155]">
            Compare total move-in costs side by side before scheduling visits.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="inline-flex rounded-xl bg-[#E2E8F0]/70 p-1 self-start">
          <button
            type="button"
            onClick={() => setSegment('flats')}
            className={`min-h-[40px] rounded-lg px-4 text-xs font-semibold transition-colors whitespace-nowrap ${
              segment === 'flats'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Saved Flats ({savedFlats.length})
          </button>
          <button
            type="button"
            onClick={() => setSegment('mates')}
            className={`min-h-[40px] rounded-lg px-4 text-xs font-semibold transition-colors whitespace-nowrap ${
              segment === 'mates'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Connected Flatmates ({connectedFlatmates.length})
          </button>
        </div>
      </div>

      {segment === 'flats' ? (
        savedFlats.length === 0 ? (
          <div className="card-level-1 rounded-2xl p-10 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-[#0F766E]/60" />
            <h2 className="mt-3 text-base font-bold text-[#0F172A]">
              No flats shortlisted yet
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              Tap the bookmark icon on any verified room to compare rents and escrow deposits here.
            </p>
            <button
              type="button"
              onClick={onGoDiscover}
              className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#F97316] px-5 text-sm font-semibold text-white hover:bg-[#EA580C]"
            >
              Explore Metro Flats
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedFlats.map((flat) => (
                <article
                  key={flat.id}
                  className="card-level-1 flex flex-col overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/10] w-full">
                    <SafeImage
                      src={flat.images[0]}
                      alt={flat.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />
                    <span className="absolute bottom-3 left-3.5 text-base font-bold tabular-nums text-white">
                      {formatINR(flat.monthlyRent)}/mo
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveSavedFlat(flat.id)}
                      aria-label={`Remove ${flat.title} from saved`}
                      className="absolute right-2.5 top-2.5 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/95 text-[#334155] hover:text-[#BA1A1A]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="text-base font-bold text-[#0F172A]">
                      {flat.title}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#475569]">
                      <MapPin className="h-3.5 w-3.5 text-[#0F766E] shrink-0" />
                      <span>
                        {flat.locality}, {flat.city}
                      </span>
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#334155] tabular-nums">
                      Deposit: {formatINR(flat.securityDeposit)} · Metro:{' '}
                      {flat.metroDistanceMeters}m
                    </p>

                    <button
                      type="button"
                      onClick={() => onOpenFlatDetail(flat)}
                      className="mt-4 min-h-[44px] w-full rounded-xl bg-[#F97316] text-xs font-semibold text-white hover:bg-[#EA580C]"
                    >
                      Schedule Visit
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Side-by-Side Move-In Cost Comparison Table */}
            {savedFlats.length >= 2 && (
              <div className="card-level-1 overflow-hidden rounded-2xl">
                <div className="border-b border-[#E2E8F0] px-5 py-4">
                  <h2 className="text-base font-bold text-[#0F172A]">
                    Move-In Budget &amp; Commute Comparison
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#475569]">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Property</th>
                        <th className="px-4 py-3 font-semibold">Monthly Rent</th>
                        <th className="px-4 py-3 font-semibold">
                          Escrow Deposit
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Upkeep Split
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Metro Walk
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                      {savedFlats.map((flat) => (
                        <tr key={flat.id} className="hover:bg-[#F8FAFC]">
                          <td className="px-5 py-3.5 font-semibold text-[#0F172A]">
                            {flat.locality}, {flat.city}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[#0F172A]">
                            {formatINR(flat.monthlyRent)}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#0F766E]">
                            {formatINR(flat.securityDeposit)}
                          </td>
                          <td className="px-4 py-3.5 text-[#334155]">
                            {formatINR(flat.maintenanceSplit)}/mo
                          </td>
                          <td className="px-4 py-3.5 text-[#334155]">
                            {flat.metroDistanceMeters}m
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )
      ) : connectedFlatmates.length === 0 ? (
        <div className="card-level-1 rounded-2xl p-10 text-center">
          <h2 className="text-base font-bold text-[#0F172A]">
            No connected flatmates yet
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            Connect with verified flatmates on the Flatmates tab to plan shared apartment tours.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectedFlatmates.map((mate) => {
            const score = computeCompatibilityScore(
              userLifestyle,
              mate.lifestyle
            );
            return (
              <article
                key={mate.id}
                className="card-level-1 flex flex-col rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold tabular-nums text-white">
                    {score}% Match
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                    Verified
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <SafeImage
                    src={mate.avatar}
                    alt={mate.name}
                    className="h-12 w-12 rounded-full object-cover border border-[#E2E8F0]"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A]">
                      {mate.name}, {mate.age}
                    </h2>
                    <p className="text-xs text-[#475569]">
                      {mate.companyOrCampus}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#334155]">
                  Budget: {formatINR(mate.budgetMin)} – {formatINR(mate.budgetMax)} · Move-in {mate.moveInDate}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onMessageFlatmate(mate)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0F766E] px-3 text-xs font-semibold text-white"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Open Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDisconnectFlatmate(mate.id)}
                    aria-label={`Remove ${mate.name} from connections`}
                    className="min-h-[44px] rounded-xl border border-[#E2E8F0] px-3 text-xs font-semibold text-[#475569] hover:text-[#BA1A1A]"
                  >
                    Remove
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
