import { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import flatIndiranagar from '../assets/images/flat_indiranagar_sunlit_1794549565592.jpg';
import avatarAarav from '../assets/images/flatmate_aarav_portrait_1794549567455.jpg';
import type { FlatListing, MetroCity, RoomType } from '../types/habitation';

interface ListRoomModalProps {
  onClose: () => void;
  onPublishRoom: (newFlat: FlatListing) => void;
}

const CITIES: Exclude<MetroCity, 'All Cities'>[] = [
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Hyderabad',
];

export function ListRoomModal({ onClose, onPublishRoom }: ListRoomModalProps) {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState<Exclude<MetroCity, 'All Cities'>>('Bengaluru');
  const [locality, setLocality] = useState('');
  const [nearestMetro, setNearestMetro] = useState('');
  const [metroDistance, setMetroDistance] = useState('500');
  const [roomType, setRoomType] = useState<RoomType>('Private Room');
  const [monthlyRent, setMonthlyRent] = useState('17500');
  const [securityDeposit, setSecurityDeposit] = useState('35000');
  const [cookAvailable, setCookAvailable] = useState(true);
  const [acIncluded, setAcIncluded] = useState(true);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locality.trim() || !nearestMetro.trim()) {
      setErrorMsg('Please fill in the room title, locality, and nearest metro station.');
      return;
    }

    const rentNum = Math.max(4000, Number(monthlyRent) || 15000);
    const depositNum = Math.max(0, Number(securityDeposit) || rentNum * 2);
    const distNum = Math.max(50, Number(metroDistance) || 500);

    const prefs: string[] = [];
    if (vegetarianOnly) prefs.push('Vegetarian');
    prefs.push('Non-smoker');
    if (cookAvailable) prefs.push('Cook Available');
    if (acIncluded) prefs.push('AC Included');

    const newFlat: FlatListing = {
      id: `flat-user-${Date.now()}`,
      title: title.trim(),
      city,
      locality: locality.trim(),
      nearestMetro: nearestMetro.trim(),
      metroDistanceMeters: distNum,
      techParkProximity: 'Direct Metro Corridor',
      roomType,
      bhkConfig: '3 BHK · Furnished',
      monthlyRent: rentNum,
      securityDeposit: depositNum,
      maintenanceSplit: 1200,
      cookAvailable,
      brokerageZero: true,
      attachedWashroom: true,
      acIncluded,
      availableFrom: 'Immediate',
      images: [flatIndiranagar],
      preferences: prefs,
      amenities: [
        'Attached Washroom',
        acIncluded ? 'Split AC' : 'Ceiling Fan & Cross-Ventilation',
        '100 Mbps Fiber',
        cookAvailable ? 'Morning Cook & Maid' : 'Modular Kitchen',
        'Escrow Deposit Protection',
      ],
      houseRules: [
        'Govt ID verified co-tenants only',
        'Zero brokerage direct digital agreement',
      ],
      poster: {
        name: 'You (Verified Host)',
        age: 26,
        role: 'Nivas Verified Member',
        avatar: avatarAarav,
        govtIdVerified: true,
        employerVerified: true,
      },
      description:
        'Listed directly by a verified flatmate on Nivas with escrow-protected security deposit and transparent monthly utility splits.',
    };

    onPublishRoom(newFlat);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/40 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-room-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <div>
            <h2 id="list-room-title" className="text-lg font-bold text-[#0F172A]">
              List a Verified Room
            </h2>
            <p className="text-xs text-[#475569]">
              Zero brokerage · Published immediately to Discover
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close list room form"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#E2E8F0] text-[#334155]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-5">
          {errorMsg && (
            <p className="rounded-xl bg-[#FFDAD6] px-3.5 py-2.5 text-xs font-semibold text-[#93000A]">
              {errorMsg}
            </p>
          )}

          <div>
            <label htmlFor="room-title" className="block text-xs font-semibold text-[#334155]">
              Listing Title
            </label>
            <input
              id="room-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sunny Private Room in HSR 2nd Sector"
              className="input-nivas mt-1.5 w-full px-3.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="room-city" className="block text-xs font-semibold text-[#334155]">
                Metro City
              </label>
              <select
                id="room-city"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value as Exclude<MetroCity, 'All Cities'>)
                }
                className="input-nivas mt-1.5 w-full px-3 text-sm"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="room-type" className="block text-xs font-semibold text-[#334155]">
                Room Type
              </label>
              <select
                id="room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="input-nivas mt-1.5 w-full px-3 text-sm"
              >
                <option value="Private Room">Private Room</option>
                <option value="Master Suite">Master Suite</option>
                <option value="Twin Sharing">Twin Sharing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="room-locality" className="block text-xs font-semibold text-[#334155]">
                Locality / Block
              </label>
              <input
                id="room-locality"
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g., HSR Layout Sector 2"
                className="input-nivas mt-1.5 w-full px-3.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="room-metro" className="block text-xs font-semibold text-[#334155]">
                Nearest Metro Station
              </label>
              <input
                id="room-metro"
                type="text"
                value={nearestMetro}
                onChange={(e) => setNearestMetro(e.target.value)}
                placeholder="e.g., Indiranagar Metro"
                className="input-nivas mt-1.5 w-full px-3.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="room-rent" className="block text-xs font-semibold text-[#334155]">
                Rent (₹/mo)
              </label>
              <input
                id="room-rent"
                type="number"
                min={3000}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="input-nivas mt-1.5 w-full px-3 text-sm tabular-nums"
              />
            </div>
            <div>
              <label htmlFor="room-deposit" className="block text-xs font-semibold text-[#334155]">
                Deposit (₹)
              </label>
              <input
                id="room-deposit"
                type="number"
                min={0}
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="input-nivas mt-1.5 w-full px-3 text-sm tabular-nums"
              />
            </div>
            <div>
              <label htmlFor="room-dist" className="block text-xs font-semibold text-[#334155]">
                Metro (m)
              </label>
              <input
                id="room-dist"
                type="number"
                min={50}
                value={metroDistance}
                onChange={(e) => setMetroDistance(e.target.value)}
                className="input-nivas mt-1.5 w-full px-3 text-sm tabular-nums"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              {
                label: 'Cook Available',
                active: cookAvailable,
                toggle: () => setCookAvailable((v) => !v),
              },
              {
                label: 'AC Included',
                active: acIncluded,
                toggle: () => setAcIncluded((v) => !v),
              },
              {
                label: 'Vegetarian Kitchen',
                active: vegetarianOnly,
                toggle: () => setVegetarianOnly((v) => !v),
              },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.toggle}
                className={`min-h-[40px] rounded-full px-3.5 text-xs font-semibold transition-colors ${
                  chip.active
                    ? 'bg-[#0F766E] text-white'
                    : 'border border-[#E2E8F0] bg-white text-[#334155]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#10B981]/10 px-3.5 py-2.5 text-xs font-medium text-[#047857]">
            <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
            <span>
              Your DigiLocker Govt ID badge will appear automatically on this listing.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] flex-1 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#334155]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[48px] flex-[1.5] rounded-xl bg-[#F97316] text-sm font-semibold text-white hover:bg-[#EA580C]"
            >
              Publish Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
