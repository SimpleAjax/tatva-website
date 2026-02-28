// Regions cache and utilities for Tatva
import { getRegions, Region } from "./medusa";

// Cache for regions to avoid repeated API calls
let regionsCache: Region[] | null = null;
let defaultRegionIdCache: string | null = null;

/**
 * Fetch and cache all regions
 */
export async function getCachedRegions(): Promise<Region[]> {
  if (regionsCache) {
    return regionsCache;
  }
  
  try {
    const { regions } = await getRegions();
    regionsCache = regions;
    return regions;
  } catch (error) {
    console.error("[Regions] Failed to fetch regions:", error);
    return [];
  }
}

/**
 * Get the default region ID (India/INR preferred)
 * Cached after first call
 */
export async function getDefaultRegionId(): Promise<string | undefined> {
  if (defaultRegionIdCache) {
    return defaultRegionIdCache;
  }
  
  const regions = await getCachedRegions();
  
  // Priority: India region with INR currency
  const indiaRegion = regions.find(r => 
    r.currency_code?.toLowerCase() === 'inr' || 
    r.name?.toLowerCase().includes('india')
  );
  
  if (indiaRegion?.id) {
    defaultRegionIdCache = indiaRegion.id;
    console.log("[Regions] Using India region:", indiaRegion.id);
    return indiaRegion.id;
  }
  
  // Fallback: first available region
  if (regions[0]?.id) {
    defaultRegionIdCache = regions[0].id;
    console.log("[Regions] Using first available region:", regions[0].id);
    return regions[0].id;
  }
  
  console.warn("[Regions] No regions found!");
  return undefined;
}

/**
 * Get region by ID from cache
 */
export async function getRegionById(id: string): Promise<Region | undefined> {
  const regions = await getCachedRegions();
  return regions.find(r => r.id === id);
}

/**
 * Clear regions cache (useful for testing)
 */
export function clearRegionsCache(): void {
  regionsCache = null;
  defaultRegionIdCache = null;
}
