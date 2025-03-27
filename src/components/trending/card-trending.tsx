/* eslint-disable no-case-declarations */
/* eslint-disable no-shadow */
import Image from 'next/image';
import Link from 'next/link';
import { IVideo } from '@interfaces/video';
import { IProduct } from '@interfaces/product';
import { IGallery } from '@interfaces/gallery';
import { formatTimeAgo, formatViews } from '@lib/media';
import { useIntl } from 'react-intl';
import styles from './card-trending.module.scss';

type ITrending = IVideo & IProduct & IGallery;
interface IProps {
  item: ITrending,
}
interface ILink {
  href: any
}
function CardTreding({ item }: IProps) {
  const intl = useIntl();

  const getThumb = (item): string => {
    let url;
    const caseCompare = item.mediaType;
    switch (caseCompare) {
      case 'video':
        url = (item?.thumbnail?.thumbnails && item?.thumbnail?.thumbnails[0])
          || (item?.teaser?.thumbnails && item?.teaser?.thumbnails[0])
          || (item?.video?.thumbnails && item?.video?.thumbnails[0])
          || '/leaf.jpg';
        break;
      case 'gallery':
        url = item?.coverPhoto?.thumbnails ? item?.coverPhoto?.thumbnails[0]
          : '/leaf.jpg';
        break;
      case 'product':
        url = item?.image || item?.thumbnail?.thumbnails[0] || '/no-image.jpg';
        break;
      default:
        const images = item.files && item.files.filter((f) => f.type === 'feed-photo');
        const videos = item.files && item.files.filter((f) => f.type === 'feed-video');
        url = item?.thumbnail?.thumbnails?.[0]
          ?? item?.thumbnail?.thumbnails[0]
          ?? images?.[0]?.thumbnails?.[0]
          ?? videos?.[0]?.thumbnails?.[0]
          ?? '/leaf.jpg';
        break;
    }
    return url;
  };

  const getLink = (item): ILink => {
    let linkProps: ILink = {
      href: ''
    };
    const caseCompare = item.trendingSource || item.source;
    switch (caseCompare) {
      case 'video':
        linkProps = {
          href: `/video/${item.slug || item._id}`
        };
        break;
      case 'gallery':
        linkProps = {
          href: `/gallery/${item?.slug || item?._id}`
        };
        break;
      case 'product':
        linkProps = {
          href: `/product/${item.slug || item._id}`
        };
        break;
      default:
        if ((item as any).isAd && (item as any).redirectLink) {
          linkProps = {
            href: (item as any)?.redirectLink
          };
          break;
        }
        linkProps = {
          href: `/post/${item.slug || item._id}${(item as any).isAd ? '?isAd=true' : ''}`
        };
        break;
    }
    return linkProps;
  };

  const thumbUrl = getThumb(item);
  const linkProps: ILink = getLink(item);
  const profileProps = {
    href: `/${item.performer?.username || item.performer?._id}`
  };

  const title = item.title || item.name || (item as any).text;
  // eslint-disable-next-line no-bitwise
  const view = (item as any)?.totalViews | item?.stats?.views;

  return (
    <div className={styles['card-trending']}>
      <Link href={linkProps.href} className={styles['card-trending-thumb']}>
        <Image src={thumbUrl} alt={item.title || item.name} fill className={styles['card-trending-thumb-image']} />
        {(item as any).isAd && (
          <p className={styles['card-trending-thumb-ad']}>
            {intl.formatMessage({ id: 'ad', defaultMessage: 'AD' })}
          </p>
        )}
      </Link>
      <div className={styles['card-trending-info']}>
        <Link href={profileProps.href} className={styles['card-trending-info-avt']}>
          <Image src={item.performer?.avatar || '/no-avatar.jpg'} alt="" fill className={styles['card-trending-avt-image']} />
        </Link>
        <div>
          <Link href={linkProps.href} className={styles['card-trending-info-title']}>
            {title}
          </Link>
          <Link href={profileProps.href} className={styles['card-trending-info-owner']}>
            {item.performer?.username || (item as any).admin?.username}
          </Link>
          <div className={styles['card-trending-info-stas']}>
            <p>
              {formatViews(view)}
              <span style={{ margin: '0 4px' }}>
                {intl.formatMessage({ id: 'views', defaultMessage: 'views' })}
              </span>
            </p>
            |
            <p>{formatTimeAgo(item.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardTreding;
