/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import FeaturedHomeListing from '@components/featured/HomeListing';
import NewestListingModel from '@components/performer/list/newest-listing';
import ReelsHomeListing from '@components/reels/home-listing';
import { IFeed } from '@interfaces/feed';
import { IPerformer } from '@interfaces/performer';
import { isMobile } from 'react-device-detect';
import style from './home-container.module.scss';

interface IProps {
  reels: IFeed[];
  performers: IPerformer[];
  featureds: IFeed[];
}

export default function HomeMainContainer({
  reels, performers, featureds
}: IProps) {
  return (
    <div className="main-container">
      <div className={style['home-container']}>
        {featureds.length > 0 ? (
          <FeaturedHomeListing feeds={featureds.slice(0, isMobile ? 4 : 6)} headless={false} />
        ) : null}
        <ReelsHomeListing reels={reels} />
        {featureds.length > 0 ? (
          <FeaturedHomeListing feeds={featureds.slice(6, isMobile ? 18 : featureds.length)} headless />
        ) : null}
        <NewestListingModel performers={performers} />
      </div>
    </div>
  );
}
