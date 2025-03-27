import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { Image } from 'antd';
import Link from 'next/link';
import { IGallery } from 'src/interfaces';
import style from './trending.module.scss';

interface IProps {
  gallery: IGallery;
}

function CardPhotoTrending({ gallery }: IProps) {
  const canView = (!gallery.isSale && gallery.isSubscribed)
    || (gallery.isSale && gallery.isBought);
  const thumbUrl = gallery?.coverPhoto?.thumbnails ? gallery?.coverPhoto?.thumbnails[0]
    : '/leaf.jpg';

  return (
    <div className={style['gallery-trending-grid-card']} key={gallery._id}>
      <Link
        href={`/gallery/${gallery?._id}`}
      >
        <div className={style['card-trending-thumb']}>
          {/* eslint-disable-next-line no-nested-ternary */}
          <div
            className={style['trending-card-bg']}
            style={{
              backgroundImage: `url(${thumbUrl})`,
              filter: !canView ? 'blur(20px)' : 'blur(0px)'
            }}
          />
          {gallery.isSale && gallery.price > 0 && (
            <div className={style['trending-bagde']}>
              <p className={style['trending-category-bg']}>
                €
                {' '}
                {(gallery.price || 0).toFixed(2)}
              </p>
            </div>
          )}
          <div className={style['card-middle']}>
            <span>
              {canView ? <AiOutlineUnlock /> : <AiOutlineLock />}
            </span>
          </div>
          <div className={style['card-bottom']}>
            <div className={style['stats-profile']}>
              <Image
                preview={false}
                alt="main-avt"
                src={gallery.performer?.avatar || '/no-avatar.jpg'}
                fallback="/no-avatar.jpg"
              />
              <h5>{(gallery.performer && gallery.performer?.username) || 'n/a'}</h5>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardPhotoTrending;
