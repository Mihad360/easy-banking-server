export interface BankAccount {
  accountNumber: string;
  userId: string;
  accountType: "savings" | "checking" | "business";
  balance: number;
  currency: string;
  status: "active" | "closed" | "suspended";
  createdAt: Date;
  updatedAt: Date;
  branchCode?: string;
  accountHolderName: string;
  accountNickname?: string;
  interestRate?: number;
  transactions?: string[];
  minimumBalance?: number;
}
