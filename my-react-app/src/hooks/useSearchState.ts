// src/hooks/useSearchState.ts
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchBusesQuery } from '../service/apiSlice';
import type { FormState } from '../interfaces/types';

// The main logic for managing state from URL, debouncing, and fetching data.
export const useSearchState = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // 1. Initialize all form and filter states from URL search parameters on first load.
    const [form, setForm] = useState<FormState>(() => {
        const searchParams = new URLSearchParams(location.search);
        return {
            from: searchParams.get('from') || '',
            to: searchParams.get('to') || '',
            date: searchParams.get('date') || '',
            travellerType: (searchParams.get('travellerType') as 'local' | 'foreign') || 'local',
            passengerCount: parseInt(searchParams.get('passengerCount') || '1', 10),
            passengerType: searchParams.get('passengerType') || '',
        };
    });
    type SortBy = 'departure_time' | 'price' | null;
     type SortOrder = 'ASC'|'DESC';
    const [selectedFilters, setSelectedFilters] = useState({
        busType: '',
        priceRange: '',
        passengerType: '',
        sortBy:  null as SortBy,
        sortOrder: null as unknown as SortOrder,
    });

    // 2. Define payload for the API query. Use `useMemo` to prevent unnecessary re-renders.
    const searchPayload = useMemo(() => ({
        ...form,
        busTypeFilter: selectedFilters.busType,
        priceRangeFilter: selectedFilters.priceRange,
        passengerTypeFilter: selectedFilters.passengerType, // Added
        sortBy: selectedFilters.sortBy,
        sortOrder: selectedFilters.sortOrder,
    }), [form, selectedFilters]);

    // 3. Skip the query if essential form fields are missing.
    const skipFetch = !form.from || !form.to || !form.date || form.passengerCount <= 0 || !form.passengerType;

    // 4. Use RTK Query hook with the memoized payload.
    const { data: buses = [], isLoading, isFetching, isError, error } = useSearchBusesQuery(searchPayload, { skip: skipFetch });

    // 5. Effect to sync filters/sort from URL on initial load or URL changes.
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setSelectedFilters({
            busType: searchParams.get('busType') || '',
            priceRange: searchParams.get('priceRange') || '',
            passengerType: searchParams.get('passengerType') || '', // Added
            sortBy: (searchParams.get('sortBy') as 'departure_time' | 'price') || null,
            sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'ASC',
        });
        setForm({
            from: searchParams.get('from') || '',
            to: searchParams.get('to') || '',
            date: searchParams.get('date') || '',
            travellerType: (searchParams.get('travellerType') as 'local' | 'foreign') || 'local',
            passengerCount: parseInt(searchParams.get('passengerCount') || '1', 10),
            passengerType: searchParams.get('passengerType') || '',
        });
    }, [location.search]);

    // 6. Debounce effect to update the URL when form or filters change.
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
          //  const currentParams = new URLSearchParams(location.search);
            const newParams = new URLSearchParams();

            // Set mandatory fields
            newParams.set('from', form.from);
            newParams.set('to', form.to);
            newParams.set('date', form.date);
            newParams.set('travellerType', form.travellerType);
            newParams.set('passengerCount', form.passengerCount.toString());
            newParams.set('passengerType', form.passengerType);

            // Set optional filters and sorts
            if (selectedFilters.busType) newParams.set('busType', selectedFilters.busType);
            if (selectedFilters.priceRange) newParams.set('priceRange', selectedFilters.priceRange);
            if (selectedFilters.sortBy) newParams.set('sortBy', selectedFilters.sortBy);
            if (selectedFilters.sortOrder) newParams.set('sortOrder', selectedFilters.sortOrder);
            if (selectedFilters.passengerType) newParams.set('passengerType', selectedFilters.passengerType);

            // Navigate only if the URL has changed to prevent infinite loops
            const newSearch = newParams.toString();
            if (location.search !== `?${newSearch}`) {
                navigate(`?${newSearch}`, { replace: true });
            }
        }, 300); // Debounce delay

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [form, selectedFilters, navigate, location.search]);

    return {
        form,
        setForm,
        selectedFilters,
        setSelectedFilters,
        buses,
        isLoading,
        isFetching,
        isError,
        error,
        skipFetch,
    };
};