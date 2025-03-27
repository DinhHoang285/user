'use client';

import { useCallback, useEffect, useRef } from 'react';
import cookie from 'js-cookie';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { TOKEN } from '@services/api-request';
import { buildUrl, isUrl } from './string';

interface Return<D> extends SWRResponse {
  data: D;
  handleTableChange: Function;
  handleFilter: Function;
  handlePaginationChange: Function;
}

interface DataResponse<D = any> {
  status: number;
  data?: D;
  message?: string;
  error?: Error;
}

export const fetcher = (url: string) => fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: cookie.get(TOKEN) || null
  }
}).then(async (r) => {
  if (r.status >= 200 && r.status <= 300) {
    return r.json();
  }

  const error = await r.json();
  throw error;
});

// This is a SWR middleware for keeping the data even if key changes.
function laggy(useSWRNext: any) {
  return (key: any, f: any, config: any) => {
    // Use a ref to store previous returned data.
    const laggyDataRef = useRef(null);

    // Actual SWR hook.
    const swr = useSWRNext(key, f, config);

    useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);

    // Expose a method to clear the laggy data, if any.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);

    // Fallback to previous data if the current data is undefined.
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data;

    // Is it showing previous data?
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined;

    // Also add a `isLagging` field to SWR.
    return {
      ...swr,
      data: dataOrLaggyData,
      isLagging,
      resetLaggy
    };
  };
}

export function useClientFetch<D = any>(
  endpoint: string,
  config?: SWRConfiguration
): Return<D> {
  const {
    data, error, isValidating, mutate, isLoading
  } = useSWR<DataResponse<D>>(
    isUrl(endpoint) ? endpoint : `${process.env.API_ENDPOINT}${endpoint}`,
    fetcher,
    {
      ...config,
      shouldRetryOnError: false,
      use: [laggy]
    }
  );

  const handleTableChange = (pag, filters, sorter) => {
    replaceRouteState({
      current: pag.current,
      pageSize: pag.pageSize,
      sortBy: sorter.field || 'updatedAt',
      sort: sorter.order === 'ascend' ? 'asc' : 'desc'
    });
  };

  const handlePaginationChange = (current: number, pageSize: number) => {
    replaceRouteState({
      current,
      pageSize
    });
  };

  const handleFilter = (values) => {
    replaceRouteState(values);
  };

  return {
    data: (data && data.data) as any,
    error,
    isValidating,
    isLoading,
    mutate,
    handleTableChange,
    handleFilter,
    handlePaginationChange
  };
}

export function replaceRouteState(query: any) {
  const { pathname } = window.location;
  const params = new URLSearchParams(window.location.search);
  const paramsObject = Object.fromEntries(params.entries());
  window.history.replaceState(null, '', `${buildUrl(pathname, { ...paramsObject, ...query })}`);
}
