import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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

  const loadData = async (id: string) => {
    try {
      const [wedding, favorites] = await Promise.all([
        getWedding(id),
        getFavorites(id, recentLimit),
      ]);

      const recentVendors = await Promise.all(
        favorites.map((f) =>
          getVendorDetails(f.vendorId).catch(() => null)
        )
      ).then((results) => results.filter(Boolean) as VendorItem[]);

      setState({ loading: false, wedding, favorites, recentVendors });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  // Initial load on mount
  useEffect(() => {
    if (!weddingId) {
      setState({ loading: false, wedding: null, favorites: [], recentVendors: [] });
      return;
    }
    loadData(weddingId);
  }, [weddingId, recentLimit]);

  // Refetch when screen regains focus (e.g., returning from edit-wedding)
  useFocusEffect(() => {
    if (weddingId) {
      loadData(weddingId);
    }
  });

  return state;
}
