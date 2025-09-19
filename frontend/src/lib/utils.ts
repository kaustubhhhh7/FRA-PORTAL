import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Forest data loading utilities
import type { ForestArea } from '@/data/mockData';
// Load from public/ so paths are stable after monorepo restructure
import forestDataUrl from '/forest_protected_areas_four_states_enriched.json?url';
import stateSchemesUrl from '/state_schemes_cards.json?url';

type EnrichedForestRow = {
  wikidata_id: string;
  name: string;
  description: string | null;
  state: string | null;
  designation: string | null;
  iucn_category: string | null;
  area_ha: number | null;
  inception: string | null;
  coordinates: string | null; // "Point(lon lat)"
  official_website: string | null;
  source: string | null;
  source_url: string | null;
  wikipedia_title: string | null;
  wikipedia_url: string | null;
};

function parsePointStringToLatLng(point: string | null): [number, number] | null {
  if (!point) return null;
  const match = point.match(/Point\(([-+]?\d*\.?\d+)\s+([-.\d]+)\)/);
  if (!match) return null;
  const lon = parseFloat(match[1]);
  const lat = parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return [lat, lon];
}

export async function loadRealForestAreas(fetchImpl: typeof fetch = fetch): Promise<ForestArea[]> {
  try {
    const res = await fetchImpl(forestDataUrl);
    if (!res.ok) throw new Error(`Failed to fetch forest data: ${res.status}`);
    const raw: EnrichedForestRow[] = await res.json();

    const toType = (designation: string | null): ForestArea['type'] => {
      const d = (designation || '').toLowerCase();
      if (d.includes('national park') || d === 'park') return 'National Park';
      if (d.includes('wildlife sanctuary') || d.includes('sanctuary')) return 'Wildlife Sanctuary';
      if (d.includes('protected')) return 'Protected Forest';
      if (d.includes('reserve')) return 'Reserve Forest';
      if (d.includes('community')) return 'Community Forest';
      return 'Forest Range';
    };

    const result: ForestArea[] = raw
      .map((row, idx) => {
        const coords = parsePointStringToLatLng(row.coordinates);
        if (!coords) return null;
        const [lat, lon] = coords;
        return {
          id: row.wikidata_id || String(idx + 1),
          name: row.name || 'Unnamed Area',
          type: toType(row.designation),
          state: row.state || 'Unknown',
          district: '—',
          coordinates: [lat, lon],
          area: row.area_ha || 0,
          forestCover: 0,
          biodiversity: 'Medium',
          protectionStatus: 'Protected',
          establishedYear: row.inception ? new Date(row.inception).getFullYear() : 0,
          description: row.description || '',
          threats: [],
          conservationMeasures: [],
          lastSurvey: new Date().toISOString().slice(0, 10),
          isActive: true,
        } as ForestArea;
      })
      .filter(Boolean) as ForestArea[];

    return result;
  } catch (e) {
    console.error('loadRealForestAreas error', e);
    return [];
  }
}

// Schemes loader and type
export type SchemeCard = {
  title: string;
  schemeName: string;
  priority?: 'High' | 'Medium' | 'Low' | null;
  status?: string | null;
  location?: string | null;
  description?: string | null;
  sector?: string | null;
  implementingAgency?: string | null;
  officialUrl?: string | null;
};

export async function loadStateSchemes(fetchImpl: typeof fetch = fetch): Promise<SchemeCard[]> {
  try {
    const res = await fetchImpl(stateSchemesUrl);
    if (!res.ok) throw new Error(`Failed to fetch schemes: ${res.status}`);
    const rows: any[] = await res.json();
    return rows.map((r) => ({
      title: (r.title || r.scheme_name || '').toString().trim(),
      schemeName: (r.scheme_name || r.title || '').toString().trim(),
      priority: r.priority && typeof r.priority === 'string' ? (r.priority.charAt(0).toUpperCase() + r.priority.slice(1).toLowerCase()) as any : null,
      status: r.status ?? null,
      location: r.location ?? null,
      description: r.description ?? null,
      sector: r.sector ?? null,
      implementingAgency: r.implementing_agency ?? null,
      officialUrl: r.official_page_url ?? null,
    }));
  } catch (e) {
    console.error('loadStateSchemes error', e);
    return [];
  }
}
