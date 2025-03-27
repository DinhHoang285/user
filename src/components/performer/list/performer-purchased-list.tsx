'use client';

import { IPerformer } from '@interfaces/performer';
import { showError } from '@lib/message';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Mousewheel,
  Navigation,
  FreeMode
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { tokenTransactionService } from '@services/token-transaction.service';
import 'swiper/css';
import 'swiper/css/navigation';
import { useMedia } from 'react-use';
import { useSession } from 'next-auth/react';
import style from './performer-bookmark-list.module.scss';
import BookmarkCard from '../card/bookmark-card';

interface IProps {
  activePer: string,
  onChangePer: Function,
}

export default function PerformerPurchasedList({ activePer, onChangePer }: IProps) {
  const [performers, setPerformers] = useState<IPerformer[]>([]);
  const { data: session } = useSession();
  const [fetching, setFetching] = useState(false);
  const offset = useRef<number>(0);
  const [total, setTotal] = useState(0);

  const isMobile = useMedia('(max-width: 768px)');
  const slideToShow = isMobile ? 5 : 8;

  const getListPerformer = async (more = false) => {
    try {
      setFetching(true);
      const resp = await tokenTransactionService.getListPerformer(session?.user._id, {
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
          speed={2000}
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
            performers.map((item) => <SwiperSlide><BookmarkCard performer={item} activePer={activePer} onClick={onChangePer} /></SwiperSlide>)
          }
        </Swiper>
        {
          !!activePer.length
          && <button type="button" className={style['bookmark-showAll']} onClick={() => onChangePer('')}>All</button>
        }
      </div>
      {!isMobile && (
        <div className="swiper-button-next" />
      )}
    </div>
  );
}
