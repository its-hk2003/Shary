import { useState } from 'react';
import {
  Bookmark,
  CalendarCheck,
  Check,
  MapPin,
  MessageSquare,
  ShieldCheck,
  TrainFront,
  X,
} from 'lucide-react';
import { formatINR } from '../data/habitationData';
import type { FlatListing } from '../types/habitation';
import { SafeImage } from './SafeImage';

interface FlatDetailSheetProps {
  flat: FlatListing;
  isSaved: boolean;
  onToggleSave: (flatId: string) => void;
  onClose: () => void;
  onScheduleVisit: (payload: {
    flat: FlatListing;
    dateLabel: string;
    timeSlot: string;
    visitType: 'In-Person' | 'Live Video Walkthrough';
  }) => void;
  onMessageHost: (flat: FlatListing) => void;
}

const DATE_OPTIONS = ['Tomorrow', 'Sat, 14 Nov', 'Sun, 15 Nov', 'Tue, 17 Nov'];
const TIME_OPTIONS = ['11:00 AM', '2:30 PM', '5:30 PM', '7:00 PM'];

export function FlatDetailSheet({
  flat,
  isSaved,
  onToggleSave,
  onClose,
  onScheduleVisit,
  onMessageHost,
}: FlatDetailSheetProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[1]);
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[0]);
  const [visitType, setVisitType] = useState<'In-Person' | 'Live Video Walkthrough'>('In-Person');
  const [bookedFeedback, setBookedFeedback] = useState(false);

  const handleBook = () => {
    onScheduleVisit({
      flat,
      dateLabel: selectedDate,
      timeSlot: selectedTime,
      visitType,
    });
    setBookedFeedback(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/40 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flat-detail-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-[#CBD5E1]" />
        </div>

        {/* Sticky Modal Top Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 sm:px-6">
          <div className="min-w-0 pr-3">
            <p className="text-xs font-semibold text-[#0F766E]">
              {flat.roomType} · {flat.bhkConfig}
            </p>
            <h2
              id="flat-detail-title"
              className="truncate text-lg font-bold text-[#0F172A]"
            >
              {flat.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(flat.id)}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark flat'}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
            >
              <Bookmark
                className={`h-5 w-5 ${
                  isSaved ? 'fill-[#F97316] text-[#F97316]' : ''
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close flat details"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {/* Photo Gallery */}
          <div className="overflow-hidden rounded-2xl bg-[#F1F5F9]">
            <div className="aspect-[16/10] w-full">
              <SafeImage
                src={flat.images[activePhotoIndex] || flat.images[0]}
                alt={`${flat.title} photo ${activePhotoIndex + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            {flat.images.length > 1 && (
              <div className="flex items-center gap-2 bg-[#F8FAFC] p-2">
                {flat.images.map((img, idx) => (
                  <button
                    key={`${flat.id}-img-${idx}`}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`h-14 w-20 overflow-hidden rounded-lg border-2 transition-opacity ${
                      activePhotoIndex === idx
                        ? 'border-[#0F766E] opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rent & Escrow Breakdown Row */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div>
              <p className="text-xs font-medium text-[#475569]">Monthly Rent</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-[#0F172A]">
                {formatINR(flat.monthlyRent)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#475569]">
                Escrow Deposit
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-[#0F766E]">
                {formatINR(flat.securityDeposit)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#475569]">
                Upkeep Split
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-[#0F172A]">
                {formatINR(flat.maintenanceSplit)}
              </p>
            </div>
          </div>

          {/* Location & Transit */}
          <div className="mt-5 space-y-2 text-sm text-[#334155]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#0F766E] shrink-0" />
              <span className="font-semibold text-[#0F172A]">
                {flat.locality}, {flat.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrainFront className="h-4 w-4 text-[#0F766E] shrink-0" />
              <span className="tabular-nums">
                {flat.metroDistanceMeters}m walk to {flat.nearestMetro} ·{' '}
                {flat.techParkProximity}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#334155]">
            {flat.description}
          </p>

          {/* Verified Poster Card */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] p-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <SafeImage
                src={flat.poster.avatar}
                alt={flat.poster.name}
                className="h-11 w-11 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0F172A]">
                  {flat.poster.name}, {flat.poster.age}
                </p>
                <p className="truncate text-xs text-[#475569]">
                  {flat.poster.role}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#10B981]/12 px-2 py-0.5 text-[11px] font-bold text-[#047857]">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Govt ID &amp; Employer Verified</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onMessageHost(flat)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#0F766E]/10 px-3.5 text-xs font-semibold text-[#0F766E] hover:bg-[#0F766E]/15 shrink-0"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message</span>
            </button>
          </div>

          {/* Amenities & House Rules */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Included Amenities
              </h3>
              <ul className="mt-2.5 space-y-2">
                {flat.amenities.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#0F172A]"
                  >
                    <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                House Rules
              </h3>
              <ul className="mt-2.5 space-y-2">
                {flat.houseRules.map((rule) => (
                  <li
                    key={rule}
                    className="text-sm leading-snug text-[#334155]"
                  >
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Visit Scheduler */}
          <div className="mt-6 border-t border-[#E2E8F0] pt-5">
            <h3 className="text-base font-bold text-[#0F172A]">
              Schedule a Property Visit
            </h3>
            <p className="mt-0.5 text-xs text-[#475569]">
              Zero obligation. Deposit remains locked in Nivas Escrow until move-in.
            </p>

            {/* Visit Mode Segmented Toggle */}
            <div className="mt-3 inline-flex rounded-xl bg-[#F1F5F9] p-1">
              {(['In-Person', 'Live Video Walkthrough'] as const).map(
                (mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setVisitType(mode)}
                    className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition-colors ${
                      visitType === mode
                        ? 'bg-white text-[#0F172A] shadow-sm'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>

            {/* Date Selector */}
            <div className="mt-3 flex flex-wrap gap-2">
              {DATE_OPTIONS.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-[40px] rounded-full px-3.5 text-xs font-semibold transition-colors ${
                    selectedDate === date
                      ? 'bg-[#0F766E] text-white'
                      : 'border border-[#E2E8F0] bg-white text-[#334155] hover:border-[#CBD5E1]'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>

            {/* Time Selector */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {TIME_OPTIONS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`min-h-[40px] rounded-lg px-3 text-xs font-semibold tabular-nums transition-colors ${
                    selectedTime === slot
                      ? 'border border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                      : 'border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Conversion Footer */}
        <div className="border-t border-[#E2E8F0] bg-white px-4 py-3 sm:px-6">
          {bookedFeedback ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#10B981]/12 px-4 py-3 text-sm font-semibold text-[#047857]">
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 shrink-0" />
                Visit confirmed for {selectedDate} at {selectedTime}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-[#047857] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onMessageHost(flat)}
                className="min-h-[48px] flex-1 rounded-xl bg-[#0F766E]/10 px-4 text-sm font-semibold text-[#0F766E] transition-colors hover:bg-[#0F766E]/15"
              >
                Message Host
              </button>
              <button
                type="button"
                onClick={handleBook}
                className="min-h-[48px] flex-[1.5] rounded-xl bg-[#F97316] px-5 text-sm font-semibold text-white transition-transform active:scale-[0.98] hover:bg-[#EA580C]"
              >
                Schedule Visit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
