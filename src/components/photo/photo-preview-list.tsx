import classNames from 'classnames';
import { IPhotos } from 'src/interfaces';
import { useViewPopup } from 'src/providers/view-media-popup/context';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  FreeMode, Keyboard, Navigation, Pagination
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './photo-preview-list.module.scss';

interface IProps {
  defaultPhotos: IPhotos[];
  isBlur?: boolean;
  gallery?: any;
}

function PhotoPreviewList({ defaultPhotos, isBlur, gallery }: IProps) {
  const { showPopup } = useViewPopup();
  return (
    <div
      className={classNames(style['list-photos'], {
        [style.blur]: isBlur
      })}
      style={
        defaultPhotos.length === 1
          ? {
            display: 'flex',
            justifyContent: 'center'
          }
          : {
            gridTemplateColumns: `repeat(${defaultPhotos.length === 10 ? 5 : defaultPhotos.length}, 1fr)`,
            border: '1px solid #666',
            borderRadius: '10px'
          }
      }
    >
      <div key={`prev-${gallery?._id}`} className={`swiper-button-prev p-${gallery?._id}`} />
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={false}
        resistanceRatio={0}
        touchReleaseOnEdges={false}
        mousewheel
        loop
        keyboard={{
          enabled: true
        }}
        speed={500}
        freeMode={{
          enabled: true,
          sticky: true
        }}
        navigation={{
          nextEl: `.n-${gallery?._id}`,
          prevEl: `.p-${gallery?._id}`
        }}
        pagination={{
          clickable: true
        }}
        modules={[Keyboard, Navigation, FreeMode, Pagination]}
        className="mySwiper"
      >
        {defaultPhotos.map((item, idx) => (
          <SwiperSlide key={`swiper_${item._id ? item._id : idx}`}>
            <div
              className={style['list-photos-item']}
              style={defaultPhotos.length === 1
                ? { width: '500px' }
                : {
                  backgroundColor: '#333'
                }}
            >
              <ImageWithFallback
                onClick={() => {
                  if (!isBlur) {
                    showPopup({
                      content: defaultPhotos.map((p) => (p.photo
                        ? { ...p.photo, type: 'photo' }
                        : { ...p, type: 'photo' })),
                      index: idx
                    });
                  }
                }}
                options={{
                  unoptimized: true,
                  quality: 80,
                  width: 200,
                  height: 200,
                  className: `${style['photo-img']} ${isBlur ? style.disabled : ''}`
                }}
                alt="gallery-photo"
                fallbackSrc="/no-image.jpg"
                src={
                  (isBlur
                    ? item?.photo?.thumbnails?.[0] || item?.thumbnails?.[0]
                    : item?.photo?.url || item?.url) || '/no-image.jpg'
                }
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div key={`next-${gallery?._id}`} className={`swiper-button-next n-${gallery?._id}`} />
    </div>
  );
}

export default PhotoPreviewList;
