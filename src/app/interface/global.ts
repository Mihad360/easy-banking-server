export const USER_ROLE = {
  admin: "admin",
  customer: "customer",
  manager: "manager",
} as const;

export const ACCOUNT_TYPE = {
  savings: "SAV",
  checking: "CHK",
  business: "BUS",
} as const;

export type TUserRole = keyof typeof USER_ROLE;
