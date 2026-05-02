export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: "tablet" | "capsule" | "liquid" | "injection" | "other";
  color?: string;
  imprint?: string;
  uses?: string[];
  notes?: string;
  pillsRemaining?: number;
  refillThreshold?: number;
  imageUrl?: string;
  addedAt: string;
}

export interface ScheduleEntry {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  times: string[]; // "HH:mm" 24-hour
  daysOfWeek: number[]; // 0 (Sun) – 6 (Sat)
  withFood?: boolean;
  startsOn: string;
  endsOn?: string;
  remindersOn: boolean;
}

export interface AnalyzedMedication {
  name: string;
  dosage: string;
  form: string;
  shape?: string;
  color?: string;
  imprint?: string | null;
  uses?: string[];
  howItWorks?: string;
  commonSideEffects?: string[];
  seriousSideEffects?: string[];
  interactions?: string[];
  dosageGuidance?: string;
  warnings?: string[];
  confidence?: "low" | "medium" | "high";
  note?: string;
  disclaimer?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance?: string;
  rating?: number;
  open?: boolean;
  hours?: string;
  phone?: string;
  lat: number;
  lng: number;
}

export interface MarketListing {
  id: string;
  medicationName: string;
  vendor: "CVS" | "Walgreens" | "Amazon Pharmacy" | "Costco" | "GoodRx";
  price: number;
  unit: string; // e.g., "30 tablets"
  shipping?: string;
  imageUrl?: string;
  link?: string;
}
