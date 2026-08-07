import type { LicenseState, ReportSectionKey } from '../types';
import { FREE_SECTIONS } from '../types';
import { storage } from './storage';

export const PREMIUM_PRICE_USD = 4.99;
export const FREE_TIER_MAX_WORK_SITES = 1;

export function getLicense(): LicenseState {
  return storage.getLicense();
}

export function isPremium(): boolean {
  return getLicense().tier === 'premium';
}

export function activatePremium(): void {
  storage.setLicense({ tier: 'premium', purchasedAt: new Date().toISOString() });
}

/** Set the license tier directly (used by Super Admin testing). Does not delete any data. */
export function setLicenseTier(tier: 'free' | 'premium'): void {
  const current = getLicense();
  storage.setLicense({ tier, purchasedAt: tier === 'premium' ? (current.purchasedAt ?? new Date().toISOString()) : null });
}

export function canAddWorkSite(currentCount: number): boolean {
  if (isPremium()) return true;
  return currentCount < FREE_TIER_MAX_WORK_SITES;
}

/** Whether a given report section requires Premium to enable. */
export function isPremiumSection(key: ReportSectionKey): boolean {
  return !FREE_SECTIONS.includes(key);
}
