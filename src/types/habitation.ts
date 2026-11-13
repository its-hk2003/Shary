export type MetroCity =
  | 'All Cities'
  | 'Bengaluru'
  | 'Mumbai'
  | 'Pune'
  | 'Delhi NCR'
  | 'Hyderabad';

export type RoomType = 'Private Room' | 'Master Suite' | 'Twin Sharing';

export type AppTab = 'discover' | 'flatmates' | 'saved' | 'visits';

export interface FlatListing {
  id: string;
  title: string;
  city: Exclude<MetroCity, 'All Cities'>;
  locality: string;
  nearestMetro: string;
  metroDistanceMeters: number;
  techParkProximity: string;
  roomType: RoomType;
  bhkConfig: string;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceSplit: number;
  cookAvailable: boolean;
  brokerageZero: boolean;
  attachedWashroom: boolean;
  acIncluded: boolean;
  availableFrom: string;
  images: string[];
  preferences: string[];
  amenities: string[];
  houseRules: string[];
  poster: {
    name: string;
    age: number;
    role: string;
    avatar: string;
    govtIdVerified: boolean;
    employerVerified: boolean;
  };
  description: string;
}

export interface LifestyleVector {
  sleepSchedule: 'Early Bird' | 'Balanced' | 'Night Owl';
  diet: 'Vegetarian' | 'Eggetarian' | 'Flexible';
  smoking: 'Non-Smoker' | 'Outdoor Only';
  workSetup: 'WFH Hybrid' | 'Office Daily' | 'Remote';
  petFriendly: boolean;
}

export interface FlatmateProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  companyOrCampus: string;
  city: Exclude<MetroCity, 'All Cities'>;
  preferredLocalities: string[];
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  avatar: string;
  govtIdVerified: boolean;
  policeCleared: boolean;
  bio: string;
  habits: string[];
  lifestyle: LifestyleVector;
}

export interface ScheduledVisit {
  id: string;
  flatId: string;
  flatTitle: string;
  locality: string;
  metroLandmark: string;
  hostName: string;
  dateLabel: string;
  timeSlot: string;
  visitType: 'In-Person' | 'Live Video Walkthrough';
  status: 'Confirmed' | 'Cancelled';
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  govtIdVerified: boolean;
  contextLabel: string;
  messages: ChatMessage[];
}

export interface KycStep {
  id: string;
  title: string;
  subtitle: string;
  status: 'Verified' | 'Pending';
  provider: string;
}
