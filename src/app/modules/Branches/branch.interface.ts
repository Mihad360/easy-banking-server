export interface TBranch {
  name: string;
  code: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode: string;
  contactNumber: string[];
  email?: string;
  managers?: string[];
  services: string[];
  openingSchedule: {
    days: string[]; // e.g., ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
    openTime: string; // e.g., "10:00"
    closeTime: string; // e.g., "17:00"
    status: "open" | "closed";
  };
  branchOpenedAt: string;
}
