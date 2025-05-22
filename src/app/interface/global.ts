export const USER_ROLE = {
  admin: "admin",
  customer: "customer",
  manager: "manager",
} as const;

export type TUserRole = keyof typeof USER_ROLE;
