'use client';

import { IPerformer } from '@interfaces/performer';
import { performerService } from '@services/performer.service';
import {
  Keyboard, Mousewheel, Navigation, FreeMode
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { useMedia } from 'react-use';
import { showError } from '@lib/message';
import withHydrationOnDemand from 'react-hydration-on-demand';
import FollowSwiperCard from '@components/performer/card/follow-swiper-card';
import { useClientFetch } from '@lib/swr-fetch';
import { buildUrl } from '@lib/string';
import { useIntl } from 'react-intl';
import style from './style.module.scss';

const FollowSwiperCardHydration = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  FollowSwiperCard
);

interface IProps {
  activePer: string,
  onChangePer: Function
}

export default function FollowListingSwiper({ activePer, onChangePer }: IProps) {
  const intl = useIntl();
  const {
    data, error
  } = useClientFetch(buildUrl(performerService.searchUrl(), {
    limit: 99,
    offset: 0,
    followed: true
  }));

  if (error) {
    showError(error);
  }

  const isMobile = useMedia('(max-width: 768px)');
  const slideToShow = isMobile ? 5 : 8;

  return (
    <div>
      {data?.data.length
        ? (
          <div style={{ marginTop: '20px' }} className={style['box-carousel']}>
            {!isMobile && (
              <div className="swiper-button-prev" />
            )}
            <div className={style['box-swiper']} style={isMobile ? { padding: '0px' } : {}}>
              <Swiper
                slidesPerView={slideToShow}
                spaceBetween={30}
                mousewheel
                keyboard={{ enabled: true }}
                speed={2000}
                freeMode={{ enabled: true, sticky: false }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
                }}
                modules={[Mousewheel, Keyboard, Navigation, FreeMode]}
                className="mySwiper"
              >
                {(data?.data || []).map((performer: IPerformer) => (
                  <SwiperSlide key={`slide_${performer._id}`}>
                    <FollowSwiperCardHydration performer={performer} activePer={activePer} onClick={onChangePer} />
                  </SwiperSlide>
                ))}
              </Swiper>
              {!!activePer.length && (
                <button
                  type="button"
                  className={style.showAll}
                  onClick={() => onChangePer('')}
                >
                  {intl.formatMessage({ id: 'all', defaultMessage: 'All' })}
                </button>
              )}
            </div>
            {!isMobile && (
              <div className="swiper-button-next" />
            )}
          </div>
        )
        : null}
    </div>
  );
}
