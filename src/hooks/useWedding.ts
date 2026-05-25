import { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { getWedding, getFavorites } from '@/src/services/weddingService';
import { getVendorDetails } from '@/src/services/vendorService';
import { Wedding, VendorLike } from '@/src/types/profile';
import { VendorItem } from '@/src/types/vendor';

interface WeddingState {
  loading: boolean;
  wedding: Wedding | null;
  favorites: VendorLike[];
  recentVendors: VendorItem[];
}

export function useWedding(recentLimit = 5): WeddingState {
  const { weddingId } = useAuth();
  const [state, setState] = useState<WeddingState>({
    loading: true,
    wedding: null,
    favorites: [],
    recentVendors: [],
  });

  useEffect(() => {
    if (!weddingId) return;

    let cancelled = false;

    async function load() {
      try {
        const [wedding, favorites] = await Promise.all([
          getWedding(weddingId),
          getFavorites(weddingId, recentLimit),
        ]);

        const recentVendors = await Promise.all(
          favorites.map((f) =>
            getVendorDetails(f.vendorId).catch(() => null)
          )
        ).then((results) => results.filter(Boolean) as VendorItem[]);

        if (!cancelled) {
          setState({ loading: false, wedding, favorites, recentVendors });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, [weddingId, recentLimit]);

  return state;
}
