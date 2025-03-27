/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */

'use client';

import { uniqBy } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import withHydrationOnDemand from 'react-hydration-on-demand';
import Link from 'next/link';
import { RiCloseLine } from 'react-icons/ri';
import { feedService } from '@services/feed.service';
import { IFeed } from '@interfaces/feed';
import ReelCard from './reel-card';
import style from './index.module.scss';

const ReelCardVisible = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  ReelCard
);

interface IProps {
  initVideos: {
    data: IFeed[];
    total: number
  }
}

export default function ReelScrollWrapper({ initVideos }: IProps) {
  const searchParams = useSearchParams();
  const includedId = searchParams.get('includedId');
  const isAd = searchParams.get('isAd');
  const performerId = searchParams.get('performerId');
  const [videos, setVideos] = useState(initVideos?.data || []);
  const [total, setTotal] = useState(initVideos?.total || 0);
  const offset = useRef(1);

  const getListReels = async () => {
    try {
      const resp = await feedService.userSearch({
        includedId: includedId || '',
        isAd: isAd || '',
        performerId: performerId || '',
        limit: 5,
        offset: offset.current * 5,
        type: 'reel'
      });

      offset.current === 0 ? setVideos(resp.data.data) : setVideos((v) => [...v, ...resp.data.data]);
      if (offset.current === 0) {
        document.getElementById(`reel_player_card_${resp.data.data[0]._id}`).scrollIntoView({ behavior: 'instant', block: 'center' });
      }
      setTotal(resp.data.total);
    } finally {
      if (videos.length < total) {
        offset.current += 1;
      }
    }
  };

  useEffect(() => {
    if (includedId && performerId) {
      offset.current = 0;
      getListReels();
    }
  }, [includedId, performerId, isAd]);

  const reels = uniqBy(videos, (v: any) => v._id);

  return (
    <div className={style['tiktok-app']}>
      <div className="nav-brand">
        <Link href="/home" aria-label="home"><RiCloseLine /></Link>
      </div>
      <div className="scroll-ct">
        {reels.length > 0 && reels.map((item, index) => (
          <ReelCardVisible
            listReels={reels}
            key={item._id}
            item={item}
            total={total}
            idx={index}
            onView={(i: number) => {
              if (i === (reels.length - 2)) {
                getListReels();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
