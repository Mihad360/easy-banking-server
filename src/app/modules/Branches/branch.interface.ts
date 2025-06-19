export interface TBranch {
  name: string;
  code: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode: string;
  reserevedBalance?: number;
  usedBalance?: number;
  contactNumber: string
  email?: string;
  managers?: string[];
  openingSchedule: {
    days: string[]; // e.g., ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
    openTime: string; // e.g., "10:00"
    closeTime: string; // e.g., "17:00"
  };
  branchOpenedAt?: Date;
}
