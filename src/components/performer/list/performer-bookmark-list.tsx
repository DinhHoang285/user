/* eslint-disable react/no-array-index-key */
import { IPerformer } from '@interfaces/performer';
import { showError } from '@lib/message';
import { reactionService } from '@services/reaction.service';
import { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import {
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { useIntl } from 'react-intl';
import style from './performer-bookmark-list.module.scss';
import BookmarkCard from '../card/bookmark-card';

interface IProps {
  activePer: string,
  onChangePer: Function,
}

export default function PerformerBookmarkList({ activePer, onChangePer }: IProps) {
  const intl = useIntl();
  const [performers, setPerformers] = useState<IPerformer[]>([]);
  const [fetching, setFetching] = useState(false);
  const offset = useRef<number>(0);
  const [total, setTotal] = useState(0);
  const isMobile = useMedia('(max-width: 768px)');
  const slideToShow = isMobile ? 5 : 8;

  const getListPerformer = async (more = false) => {
    try {
      setFetching(true);
      const resp = await reactionService.getBookmarks({
        objectType: 'performer',
        limit: 12,
        offset: offset.current * 12
      });

      !more
        ? setPerformers(resp.data.data)
        : setPerformers([...performers, ...resp.data.data]);
      setTotal(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getListPerformer();
  }, []);

  const handleAfterChange = (swiper: any) => {
    if (swiper && swiper.activeIndex) {
      if (swiper.activeIndex + slideToShow >= performers.length - 1 && performers.length < total) {
        offset.current += 1;
        getListPerformer(true);
      }
    }
  };

  if (performers.length === 0) return null;

  return (
    <div style={{ marginTop: '20px' }} className={style['box-carousel']}>
      {!isMobile && (
        <div className="swiper-button-prev" />
      )}
      <div className={style['box-swiper']} style={isMobile ? { padding: '0px' } : {}}>
        <Swiper
          slidesPerView={slideToShow}
          spaceBetween={30}
          mousewheel
          keyboard={{
            enabled: true
          }}
          speed={1000}
          freeMode={{
            enabled: true,
            sticky: false
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          modules={[Mousewheel, Keyboard, Navigation, FreeMode]}
          className="mySwiper"
          onSlideChange={(swiper) => {
            if (!fetching) {
              handleAfterChange(swiper);
            }
          }}
        >
          {
            performers.map((item, index: number) => (
              <SwiperSlide key={index}>
                <BookmarkCard performer={item} activePer={activePer} onClick={onChangePer} />
              </SwiperSlide>
            ))
          }
        </Swiper>
        {
          !!activePer.length && (
            <button
              type="button"
              className={style['bookmark-showAll']}
              onClick={() => onChangePer('')}
            >
              {intl.formatMessage({ id: 'all', defaultMessage: 'All' })}
            </button>
          )
        }
      </div>
      {!isMobile && (
        <div className="swiper-button-next" />
      )}
    </div>
  );
}
