'use client';

import {
  AiOutlineSync, AiOutlineTag, AiOutlineLeft, AiOutlineRight
} from 'react-icons/ai';
import { showError } from '@lib/message';
import { performerService } from '@services/performer.service';
import { Carousel } from 'antd';
import { chunk } from 'lodash';
import { useRef } from 'react';
import { IPerformer } from 'src/interfaces';
import { useIntl } from 'react-intl';
import withHydrationOnDemand from 'react-hydration-on-demand';
import SuggestionPerformerCard from '@components/performer/card/suggestion-card';
import { useClientFetch } from '@lib/swr-fetch';
import { buildUrl } from '@lib/string';
import { useSearchParams } from 'next/navigation';
import style from './style.module.scss';

const SuggestionPerformerCardHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  SuggestionPerformerCard
);

export function SuggestionPerformerListing() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(new URLSearchParams(searchParams));
  const {
    data, error, isLoading, handleFilter
  } = useClientFetch(buildUrl(performerService.randomSearchUrl(), {
    isFreeSubscription: '',
    ...params
  }));

  if (error) {
    showError(error);
  }

  const intl = useIntl();
  const carouselRef = useRef(null) as any;

  const chunkPerformers = chunk((data?.data || []), 4);

  const noData = !isLoading && !chunkPerformers?.length;

  return (
    <div className={style['suggestion-bl']}>
      <div className={style['sug-top']}>
        <span className={style['sug-text']}>
          {intl.formatMessage({ id: 'suggestion', defaultMessage: 'SUGGESTIONS' })}
        </span>
        <div className={style['btns-grp']}>
          <button type="button" onClick={() => handleFilter({ isFreeSubscription: true })}>
            <AiOutlineTag />
          </button>
          <button type="button" onClick={() => handleFilter({ isFreeSubscription: '' })}>
            <AiOutlineSync />
          </button>
          {!noData && (
            <button
              type="button"
              className={style['btns-grp-nav']}
              onClick={() => carouselRef.current && carouselRef.current.prev()}
            >
              <AiOutlineLeft />
            </button>
          )}
          {!noData && (
            <button
              type="button"
              className={style['btns-grp-nav']}
              onClick={() => carouselRef.current && carouselRef.current.next()}
            >
              <AiOutlineRight />
            </button>
          )}
        </div>
      </div>
      <div className="sug-content">
        {!noData && (
          <Carousel
            autoplay
            autoplaySpeed={5000}
            adaptiveHeight
            ref={carouselRef}
            swipeToSlide
            arrows={false}
            dots={false}
            prevArrow={<AiOutlineLeft />}
            nextArrow={<AiOutlineRight />}
          >
            {chunkPerformers.length > 0 && chunkPerformers.map((arr: any) => (
              <div key={`chunk_suggestion_${arr[0]?._id}`}>
                {arr.length > 0 && arr.map((p: IPerformer) => <SuggestionPerformerCardHydration performer={p} key={`suggestion_${p._id}`} />)}
              </div>
            ))}
          </Carousel>
        )}
        {noData && (
          <p className="text-center">
            {intl.formatMessage({ id: 'NoProfileWasFound', defaultMessage: 'No profile was found' })}
          </p>
        )}
      </div>
    </div>
  );
}

export default SuggestionPerformerListing;
