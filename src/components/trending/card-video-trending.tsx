import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';
import { Image } from 'antd';
import Link from 'next/link';
import { IVideo } from 'src/interfaces';
import style from './trending.module.scss';

interface IProps {
  video: IVideo;
}

function CardVideoTrending({ video }: IProps) {
  const canView = (!video.isSale && video.isSubscribed) || (video.isSale && video.isBought);
  const thumbUrl = (video?.thumbnail?.thumbnails && video?.thumbnail?.thumbnails[0])
    || (video?.teaser?.thumbnails && video?.teaser?.thumbnails[0])
    || (video?.video?.thumbnails && video?.video?.thumbnails[0])
    || '/leaf.jpg';

  return (
    <div className={style['video-trending-grid-card']} key={video._id}>
      <Link
        href={`/video/${video.slug || video._id}`}
      >
        <div className={style['card-trending-thumb']}>
          <div
            className={style['trending-card-bg']}
            style={{
              backgroundImage: `url(${thumbUrl})`,
              filter: !canView ? 'blur(20px)' : 'blur(0px)'
            }}
          />
          {
            video.isSale && video.price > 0 && (
              <div className={style['trending-bagde']}>
                <p className={style['trending-category-bg']}>
                  €
                  {' '}
                  {(video.price || 0).toFixed(2)}
                </p>
              </div>
            )
          }
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
                src={video.performer?.avatar || '/no-avatar.jpg'}
                fallback="/no-avatar.jpg"
              />
              <h5>{video.performer.username || 'n/a'}</h5>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardVideoTrending;
