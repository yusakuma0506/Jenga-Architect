export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  isPro: boolean;
  role: string;
};

export const userSelect = {
  id: true,
  email: true,
  image: true,
  name: true,
  isPro: true,
  role: true,
} as const;
