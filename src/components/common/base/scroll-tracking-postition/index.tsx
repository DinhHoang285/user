'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { IFeed } from '@interfaces/feed';
import { buildUrl } from '@lib/string';

type IProps = {
  chunkItems: Array<IFeed[]>;
  prefixId: string;
}

export default function ScrollListTrackerPosition({ chunkItems, prefixId }: IProps) {
  const page = useSearchParams().get('page');
  const pathname = usePathname();
  const currentPage = useRef(Number(page || 1) + 1);
  const routerQuery = useRef({ page: currentPage.current });
  const _pageIds = useRef([]);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    sessionStorage.setItem('page', `${page}`);
    return () => {
      sessionStorage.removeItem('page');
    };
  }, [page]);

  useEffect(() => {
    routerQuery.current = { page: Number(page || 1) };
    const handleScroll = (e) => {
      e.preventDefault();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      lastScrollTop.current = scrollY <= 0 ? 0 : scrollY;

      const activeBlock = _pageIds.current.find((p: any) => {
        if (!p) return null;
        // to track from bottom window, zoomed out 82%
        return (p.fromY <= scrollY) && (scrollY <= p.toY);
      });

      if (activeBlock) {
        // detect is first page to update router
        // change current in pagination
        const _page = sessionStorage.getItem('page');
        if (`${activeBlock.page}` !== _page && _page !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          // Convert to an object
          const paramsObject = Object.fromEntries(params.entries());
          window.history.replaceState(null, '', `${buildUrl(pathname, { ...paramsObject, page: activeBlock.page || 1 })}`);
        }
      }
    };
    window.removeEventListener('scroll', handleScroll); // remove memorized event
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // calculate page
  useEffect(() => {
    if (chunkItems.length > 0) {
      const initialRouterPage = Number(routerQuery.current.page || 1);
      // timeout to wait for html render
      setTimeout(() => {
        chunkItems.forEach((arr: any, index: number) => {
          const exists = _pageIds.current.find((f) => f.page === (initialRouterPage + index));
          if (exists) return;
          const ele = document.getElementById(`${prefixId}${index}`);

          if (!ele) return;
          const fromY = Number(ele?.offsetTop || 0);
          const toY = Number(ele?.offsetTop || 0) + Number(ele?.offsetHeight || 0);
          _pageIds.current = [..._pageIds.current, {
            page: initialRouterPage + index,
            fromY,
            toY
          }];
        });
      }, 1000);
    }
  }, [JSON.stringify(chunkItems)]);

  useEffect(() => {
    sessionStorage.setItem('page', `${page}`);
    return () => {
      sessionStorage.removeItem('page');
    };
  }, [page]);

  return null;
}
