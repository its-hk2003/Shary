/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { DiscoverScreen } from './components/DiscoverScreen';
import { FlatDetailSheet } from './components/FlatDetailSheet';
import { FlatmatesScreen } from './components/FlatmatesScreen';
import { ListRoomModal } from './components/ListRoomModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SavedScreen } from './components/SavedScreen';
import { TopNav } from './components/TopNav';
import { VisitsScreen } from './components/VisitsScreen';
import {
  INITIAL_FLATMATES,
  INITIAL_FLATS,
  INITIAL_KYC_STEPS,
  INITIAL_THREADS,
  INITIAL_USER_LIFESTYLE,
  INITIAL_VISITS,
  formatINR,
} from './data/habitationData';
import type {
  AppTab,
  ChatThread,
  FlatListing,
  FlatmateProfile,
  KycStep,
  LifestyleVector,
  ScheduledVisit,
} from './types/habitation';

const STORAGE_KEY = 'nivas_metro_habitation_v1';

interface PersistedState {
  flats: FlatListing[];
  savedFlatIds: string[];
  connectedFlatmateIds: string[];
  userLifestyle: LifestyleVector;
  visits: ScheduledVisit[];
  threads: ChatThread[];
  kycSteps: KycStep[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (
        Array.isArray(parsed.flats) &&
        Array.isArray(parsed.savedFlatIds) &&
        Array.isArray(parsed.connectedFlatmateIds) &&
        parsed.userLifestyle &&
        Array.isArray(parsed.visits) &&
        Array.isArray(parsed.threads) &&
        Array.isArray(parsed.kycSteps)
      ) {
        return parsed as PersistedState;
      }
    }
  } catch {
    // Fallback to initial curated data when storage is unavailable
  }
  return {
    flats: INITIAL_FLATS,
    savedFlatIds: ['flat-blr-101', 'flat-pnq-412'],
    connectedFlatmateIds: ['mate-1'],
    userLifestyle: INITIAL_USER_LIFESTYLE,
    visits: INITIAL_VISITS,
    threads: INITIAL_THREADS,
    kycSteps: INITIAL_KYC_STEPS,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());
  const [activeTab, setActiveTab] = useState<AppTab>('discover');
  const [selectedFlat, setSelectedFlat] = useState<FlatListing | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string>(
    () => state.threads[0]?.id || 'thread-aarav'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const savedFlats = useMemo(
    () => state.flats.filter((f) => state.savedFlatIds.includes(f.id)),
    [state.flats, state.savedFlatIds]
  );

  const connectedFlatmates = useMemo(
    () =>
      INITIAL_FLATMATES.filter((m) =>
        state.connectedFlatmateIds.includes(m.id)
      ),
    [state.connectedFlatmateIds]
  );

  const confirmedVisitCount = useMemo(
    () => state.visits.filter((v) => v.status === 'Confirmed').length,
    [state.visits]
  );

  const handleToggleSaveFlat = (flatId: string) => {
    setState((prev) => {
      const exists = prev.savedFlatIds.includes(flatId);
      const nextSaved = exists
        ? prev.savedFlatIds.filter((id) => id !== flatId)
        : [...prev.savedFlatIds, flatId];
      setToastMessage(
        exists ? 'Removed from your shortlist' : 'Shortlisted flat saved'
      );
      return { ...prev, savedFlatIds: nextSaved };
    });
  };

  const handleToggleConnectFlatmate = (mateId: string) => {
    setState((prev) => {
      const exists = prev.connectedFlatmateIds.includes(mateId);
      const nextIds = exists
        ? prev.connectedFlatmateIds.filter((id) => id !== mateId)
        : [...prev.connectedFlatmateIds, mateId];
      setToastMessage(
        exists ? 'Connection removed' : 'Connection request sent'
      );
      return { ...prev, connectedFlatmateIds: nextIds };
    });
  };

  const handleScheduleVisit = (payload: {
    flat: FlatListing;
    dateLabel: string;
    timeSlot: string;
    visitType: 'In-Person' | 'Live Video Walkthrough';
  }) => {
    const newVisit: ScheduledVisit = {
      id: `visit-${Date.now()}`,
      flatId: payload.flat.id,
      flatTitle: payload.flat.title,
      locality: `${payload.flat.locality}, ${payload.flat.city}`,
      metroLandmark: `${payload.flat.metroDistanceMeters}m from ${payload.flat.nearestMetro}`,
      hostName: payload.flat.poster.name,
      dateLabel: payload.dateLabel,
      timeSlot: payload.timeSlot,
      visitType: payload.visitType,
      status: 'Confirmed',
    };
    setState((prev) => ({
      ...prev,
      visits: [newVisit, ...prev.visits],
    }));
    setToastMessage(`Visit confirmed for ${payload.dateLabel} at ${payload.timeSlot}`);
  };

  const handleCancelVisit = (visitId: string) => {
    setState((prev) => ({
      ...prev,
      visits: prev.visits.map((v) =>
        v.id === visitId ? { ...v, status: 'Cancelled' } : v
      ),
    }));
    setToastMessage('Property visit cancelled');
  };

  const openOrCreateThread = (
    name: string,
    role: string,
    avatar: string,
    govtIdVerified: boolean,
    contextLabel: string
  ) => {
    const existing = state.threads.find((t) => t.participantName === name);
    if (existing) {
      setActiveThreadId(existing.id);
    } else {
      const newThread: ChatThread = {
        id: `thread-${Date.now()}`,
        participantName: name,
        participantRole: role,
        participantAvatar: avatar,
        govtIdVerified,
        contextLabel,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'them',
            text: `Hi! Feel free to ask about the move-in date, house rules, or metro commute.`,
            timestamp: 'Just now',
          },
        ],
      };
      setState((prev) => ({
        ...prev,
        threads: [newThread, ...prev.threads],
      }));
      setActiveThreadId(newThread.id);
    }
    setSelectedFlat(null);
    setActiveTab('visits');
  };

  const handleMessageHost = (flat: FlatListing) => {
    openOrCreateThread(
      flat.poster.name,
      `Host · ${flat.locality}`,
      flat.poster.avatar,
      flat.poster.govtIdVerified,
      `${formatINR(flat.monthlyRent)}/mo · ${flat.nearestMetro}`
    );
  };

  const handleMessageFlatmate = (mate: FlatmateProfile) => {
    openOrCreateThread(
      mate.name,
      `${mate.role} · ${mate.city}`,
      mate.avatar,
      mate.govtIdVerified,
      `Budget ${formatINR(mate.budgetMin)}–${formatINR(mate.budgetMax)} · Move-in ${mate.moveInDate}`
    );
  };

  const handleSendMessage = (threadId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: 'me',
                  text,
                  timestamp: 'Just now',
                },
              ],
            }
          : t
      ),
    }));
  };

  const handleToggleKycStep = (stepId: string) => {
    setState((prev) => ({
      ...prev,
      kycSteps: prev.kycSteps.map((s) =>
        s.id === stepId
          ? { ...s, status: s.status === 'Verified' ? 'Pending' : 'Verified' }
          : s
      ),
    }));
    setToastMessage('KYC Trust Pass updated');
  };

  const handlePublishRoom = (newFlat: FlatListing) => {
    setState((prev) => ({
      ...prev,
      flats: [newFlat, ...prev.flats],
    }));
    setActiveTab('discover');
    setToastMessage('Room published to Discover feed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-12">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenListRoom={() => setShowListModal(true)}
        savedCount={state.savedFlatIds.length}
        visitCount={confirmedVisitCount}
      />

      <main className="mx-auto max-w-[1200px] px-4 pt-6 md:px-6 md:pt-8">
        {activeTab === 'discover' && (
          <DiscoverScreen
            flats={state.flats}
            savedFlatIds={state.savedFlatIds}
            onToggleSave={handleToggleSaveFlat}
            onSelectFlat={setSelectedFlat}
          />
        )}

        {activeTab === 'flatmates' && (
          <FlatmatesScreen
            flatmates={INITIAL_FLATMATES}
            userLifestyle={state.userLifestyle}
            onUpdateLifestyle={(next) =>
              setState((prev) => ({ ...prev, userLifestyle: next }))
            }
            connectedIds={state.connectedFlatmateIds}
            onToggleConnect={handleToggleConnectFlatmate}
            onMessageFlatmate={handleMessageFlatmate}
          />
        )}

        {activeTab === 'saved' && (
          <SavedScreen
            savedFlats={savedFlats}
            connectedFlatmates={connectedFlatmates}
            userLifestyle={state.userLifestyle}
            onRemoveSavedFlat={handleToggleSaveFlat}
            onOpenFlatDetail={setSelectedFlat}
            onDisconnectFlatmate={handleToggleConnectFlatmate}
            onMessageFlatmate={handleMessageFlatmate}
            onGoDiscover={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'visits' && (
          <VisitsScreen
            visits={state.visits}
            onCancelVisit={handleCancelVisit}
            threads={state.threads}
            activeThreadId={activeThreadId}
            onSelectThread={setActiveThreadId}
            onSendMessage={handleSendMessage}
            kycSteps={state.kycSteps}
            onToggleKycStep={handleToggleKycStep}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={state.savedFlatIds.length}
        visitCount={confirmedVisitCount}
      />

      {selectedFlat && (
        <FlatDetailSheet
          flat={selectedFlat}
          isSaved={state.savedFlatIds.includes(selectedFlat.id)}
          onToggleSave={handleToggleSaveFlat}
          onClose={() => setSelectedFlat(null)}
          onScheduleVisit={handleScheduleVisit}
          onMessageHost={handleMessageHost}
        />
      )}

      {showListModal && (
        <ListRoomModal
          onClose={() => setShowListModal(false)}
          onPublishRoom={handlePublishRoom}
        />
      )}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="floating-level-2 fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white md:bottom-6 whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
