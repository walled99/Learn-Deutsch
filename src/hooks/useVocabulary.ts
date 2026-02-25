/**
 * LernDeutsch AI - Vocabulary Hook
 * With optimistic updates and per-operation loading/error states.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Vocabulary, VocabularyFormData, FilterState } from "../types";
import {
  fetchVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getVocabularyStats,
} from "../services/vocabulary";

interface VocabularyState {
  vocabulary: Vocabulary[];
  isLoading: boolean;
  error: string | null;
  isAdding: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  operationError: string | null;
  stats: {
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    recentCount: number;
  } | null;
}

export const useVocabulary = (initialFilters?: Partial<FilterState>) => {
  const [state, setState] = useState<VocabularyState>({
    vocabulary: [],
    isLoading: true,
    error: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    operationError: null,
    stats: null,
  });

  const [filters, setFilters] = useState<Partial<FilterState>>(
    initialFilters || {},
  );

  // Serialize filters for stable dependency comparison
  const filtersKey = useRef(JSON.stringify(filters));

  const loadVocabulary = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await fetchVocabulary(filters);

    if (result.success && result.data) {
      setState((prev) => ({
        ...prev,
        vocabulary: result.data as Vocabulary[],
        isLoading: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        error: result.error || "Failed to load vocabulary",
        isLoading: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey.current]);

  const loadStats = useCallback(async () => {
    const stats = await getVocabularyStats();
    setState((prev) => ({ ...prev, stats }));
  }, []);

  // Re-run when filters change
  useEffect(() => {
    filtersKey.current = JSON.stringify(filters);
    loadVocabulary();
  }, [filters, loadVocabulary]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const clearOperationError = useCallback(() => {
    setState((prev) => ({ ...prev, operationError: null }));
  }, []);

  const addVocabulary = useCallback(
    async (formData: VocabularyFormData) => {
      setState((prev) => ({
        ...prev,
        isAdding: true,
        operationError: null,
      }));

      const result = await createVocabulary(formData);

      if (result.success && result.data) {
        // Optimistic: prepend the new item to local state
        setState((prev) => ({
          ...prev,
          isAdding: false,
          vocabulary: [result.data as Vocabulary, ...prev.vocabulary],
        }));
        // Refresh stats in background
        loadStats();
      } else {
        setState((prev) => ({
          ...prev,
          isAdding: false,
          operationError: result.error || "Failed to add vocabulary",
        }));
      }

      return result;
    },
    [loadStats],
  );

  const editVocabulary = useCallback(
    async (id: string, formData: Partial<VocabularyFormData>) => {
      setState((prev) => ({
        ...prev,
        isEditing: true,
        operationError: null,
      }));

      const result = await updateVocabulary(id, formData);

      if (result.success && result.data) {
        // Optimistic: update the item in local state
        const updatedItem = result.data as Vocabulary;
        setState((prev) => ({
          ...prev,
          isEditing: false,
          vocabulary: prev.vocabulary.map((v) =>
            v.id === id ? updatedItem : v,
          ),
        }));
        loadStats();
      } else {
        setState((prev) => ({
          ...prev,
          isEditing: false,
          operationError: result.error || "Failed to update vocabulary",
        }));
      }

      return result;
    },
    [loadStats],
  );

  const removeVocabulary = useCallback(
    async (id: string) => {
      setState((prev) => ({
        ...prev,
        isDeleting: true,
        operationError: null,
      }));

      const result = await deleteVocabulary(id);

      if (result.success) {
        // Optimistic: remove the item from local state
        setState((prev) => ({
          ...prev,
          isDeleting: false,
          vocabulary: prev.vocabulary.filter((v) => v.id !== id),
        }));
        loadStats();
      } else {
        setState((prev) => ({
          ...prev,
          isDeleting: false,
          operationError: result.error || "Failed to delete vocabulary",
        }));
      }

      return result;
    },
    [loadStats],
  );

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadVocabulary(), loadStats()]);
  }, [loadVocabulary, loadStats]);

  return {
    ...state,
    filters,
    setFilters: updateFilters,
    addVocabulary,
    editVocabulary,
    removeVocabulary,
    clearOperationError,
    refresh,
  };
};
