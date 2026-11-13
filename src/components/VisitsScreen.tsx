import { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Lock,
  Send,
  ShieldCheck,
  TrainFront,
  XCircle,
} from 'lucide-react';
import type { ChatThread, KycStep, ScheduledVisit } from '../types/habitation';
import { SafeImage } from './SafeImage';

interface VisitsScreenProps {
  visits: ScheduledVisit[];
  onCancelVisit: (visitId: string) => void;
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  kycSteps: KycStep[];
  onToggleKycStep: (stepId: string) => void;
}

export function VisitsScreen({
  visits,
  onCancelVisit,
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  kycSteps,
  onToggleKycStep,
}: VisitsScreenProps) {
  const [subTab, setSubTab] = useState<'visits' | 'messages' | 'kyc'>('visits');
  const [draft, setDraft] = useState('');

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !activeThread) return;
    onSendMessage(activeThread.id, trimmed);
    setDraft('');
  };

  const verifiedCount = kycSteps.filter((k) => k.status === 'Verified').length;

  return (
    <section aria-label="Visits, Messages, and KYC Verification">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold leading-[34px] md:leading-[40px] tracking-[-0.02em] text-[#0F172A]">
            Visits, messages &amp; trust pass
          </h1>
          <p className="mt-1.5 text-sm md:text-base text-[#334155]">
            Track scheduled flat tours, talk directly with verified hosts, and manage your KYC dossier.
          </p>
        </div>

        {/* Sub-view segmented selector */}
        <div className="inline-flex rounded-xl bg-[#E2E8F0]/70 p-1 self-start">
          <button
            type="button"
            onClick={() => setSubTab('visits')}
            className={`min-h-[40px] rounded-lg px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subTab === 'visits'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Visits ({visits.filter((v) => v.status === 'Confirmed').length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('messages')}
            className={`min-h-[40px] rounded-lg px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subTab === 'messages'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Messages ({threads.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('kyc')}
            className={`min-h-[40px] rounded-lg px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subTab === 'kyc'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            KYC Pass ({verifiedCount}/{kycSteps.length})
          </button>
        </div>
      </div>

      {subTab === 'visits' && (
        <div className="space-y-4">
          {visits.length === 0 ? (
            <div className="card-level-1 rounded-2xl p-8 text-center">
              <CalendarCheck className="mx-auto h-8 w-8 text-[#0F766E]/60" />
              <p className="mt-3 text-base font-bold text-[#0F172A]">
                No property visits scheduled yet
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                Open any flat listing and pick a convenient time slot for an in-person or live video tour.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {visits.map((visit) => (
                <article
                  key={visit.id}
                  className="card-level-1 flex flex-col justify-between rounded-2xl p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          visit.status === 'Confirmed'
                            ? 'bg-[#10B981]/12 text-[#047857]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {visit.status === 'Confirmed' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        <span>{visit.status}</span>
                      </span>
                      <span className="text-xs font-semibold text-[#0F766E]">
                        {visit.visitType}
                      </span>
                    </div>

                    <h2 className="mt-3 text-base font-bold text-[#0F172A]">
                      {visit.flatTitle}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#334155]">
                      {visit.locality}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#475569]">
                      <TrainFront className="h-3.5 w-3.5 text-[#0F766E]" />
                      <span>{visit.metroLandmark}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3.5">
                    <div className="text-xs">
                      <p className="font-bold tabular-nums text-[#0F172A]">
                        {visit.dateLabel} · {visit.timeSlot}
                      </p>
                      <p className="text-[#475569]">Host: {visit.hostName}</p>
                    </div>

                    {visit.status === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => onCancelVisit(visit.id)}
                        className="min-h-[40px] rounded-lg border border-[#E2E8F0] px-3 text-xs font-semibold text-[#334155] hover:border-[#BA1A1A] hover:text-[#BA1A1A]"
                      >
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'messages' && activeThread && (
        <div className="card-level-1 grid grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-[290px_1fr]">
          {/* Thread Selector Sidebar */}
          <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] md:border-b-0 md:border-r">
            <div className="border-b border-[#E2E8F0] px-4 py-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Verified Conversations
              </h2>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {threads.map((thread) => {
                const selected = thread.id === activeThread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => onSelectThread(thread.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                      selected ? 'bg-white' : 'hover:bg-white/70'
                    }`}
                  >
                    <SafeImage
                      src={thread.participantAvatar}
                      alt={thread.participantName}
                      className="h-10 w-10 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-sm font-bold text-[#0F172A]">
                          {thread.participantName}
                        </span>
                        <span className="text-[11px] text-[#64748B] shrink-0">
                          {lastMsg?.timestamp}
                        </span>
                      </div>
                      <p className="truncate text-xs text-[#0F766E] font-medium">
                        {thread.participantRole}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#475569]">
                        {lastMsg?.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Pane */}
          <div className="flex h-[460px] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <SafeImage
                  src={activeThread.participantAvatar}
                  alt={activeThread.participantName}
                  className="h-9 w-9 rounded-full object-cover border border-[#E2E8F0]"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span>{activeThread.participantName}</span>
                    {activeThread.govtIdVerified && (
                      <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
                    )}
                  </p>
                  <p className="truncate text-xs text-[#475569]">
                    {activeThread.contextLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-[#F1F5F9] text-[#0F172A]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-[#64748B]">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-[#E2E8F0] p-3 sm:px-5"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${activeThread.participantName}...`}
                aria-label="Write a message"
                className="input-nivas flex-1 px-4 text-sm"
              />
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-[#F97316] px-4 text-sm font-semibold text-white hover:bg-[#EA580C] shrink-0"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {subTab === 'kyc' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Trust Pass Summary Card */}
          <div className="card-level-1 rounded-2xl p-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/12 px-3 py-1 text-xs font-bold text-[#047857]">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              <span>Nivas Trust Pass</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-[#0F172A]">
              {verifiedCount === kycSteps.length
                ? 'Fully Cleared for Metro Move-In'
                : `${verifiedCount} of ${kycSteps.length} Checks Completed`}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#334155]">
              Hosts prioritize Aadhaar-verified applicants. Your masked identity document is never shared publicly until you sign a flatshare agreement.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 text-xs text-[#334155]">
              <Lock className="h-4 w-4 text-[#0F766E] shrink-0" />
              <span>
                Security deposits are held in RBI-compliant escrow and released only after joint check-out inspection.
              </span>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="card-level-1 divide-y divide-[#E2E8F0] rounded-2xl lg:col-span-2">
            {kycSteps.map((step) => {
              const isVerified = step.status === 'Verified';
              return (
                <div
                  key={step.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0" />
                      ) : (
                        <Clock className="h-5 w-5 text-[#F97316] shrink-0" />
                      )}
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1 pl-7 text-xs text-[#475569]">
                      {step.subtitle} · {step.provider}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleKycStep(step.id)}
                    className={`min-h-[44px] rounded-xl px-4 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      isVerified
                        ? 'bg-[#10B981]/12 text-[#047857]'
                        : 'bg-[#F97316] text-white hover:bg-[#EA580C]'
                    }`}
                  >
                    {isVerified ? 'Verified ✓' : 'Complete Verification'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
