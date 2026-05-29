export function isPremiumLevel(level: string): boolean {
  const normalized = level.toUpperCase();
  return normalized === 'JUNIOR' || normalized === 'SENIOR';
}

export function parseLevel(level: string): 'ENTRY' | 'JUNIOR' | 'SENIOR' | null {
  const normalized = level.toUpperCase();
  if (normalized === 'ENTRY' || normalized === 'JUNIOR' || normalized === 'SENIOR') {
    return normalized;
  }
  return null;
}

export function canAccessLevel(
  user: { isPro: boolean; role: string } | null,
  level: string
): boolean {
  if (!isPremiumLevel(level)) return true;
  if (!user) return false;
  return user.isPro || user.role === 'ADMIN';
}
