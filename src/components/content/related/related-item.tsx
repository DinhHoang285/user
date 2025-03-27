'use client';

import ImageWithFallback from '@components/common/images/image-fallback';
import { IFeed } from '@interfaces/feed';
import { IProduct } from '@interfaces/product';
import { getCanView } from '@lib/media';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { AiOutlineLock } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import styles from './releted.module.scss';

interface IProps {
  media: IFeed,
}

function RelatedItem({ media }: IProps) {
  const intl = useIntl();

  const canView: boolean = getCanView(media, !!media.isBought);
  const thumbUrl = media?.files?.length && media?.files[0].thumbnails.length
    ? media.files[0].thumbnails[0]
    : '/leaf.jpg';

  return (
    <Link href={`/post/${media.slug}`} className={styles['related-item-wrapper']}>
      <div className={styles['related-item-thumb']}>
        {!!((media as any)?.isSale && media?.price > 0) && (
          <div className={styles['related-item-price']}>
            <p>
              €
              {media?.price}
            </p>
          </div>
        )}
        {!!((media as unknown as IProduct).stock > 0 && (media as unknown as IProduct).type === 'physical') && (
          <div className={styles['related-item-stock']}>
            <p>
              {Math.round((media as unknown as IProduct).stock)}
              {' '}
              {intl.formatMessage({
                id: 'inStock',
                defaultMessage: 'in stock'
              })}
            </p>
          </div>
        )}
        {!!((media as any)?.price && (media as any)?.name) && (
          <div className={styles['related-item-productPrice']}>
            <p>
              €
              {' '}
              {media?.price}
            </p>
          </div>
        )}
        <div className={styles['related-item-image']}>
          <ImageWithFallback
            options={{
              unoptimized: true,
              width: 250,
              height: 250,
              quality: 70,
              sizes: '(max-width: 768px) 30vw, (max-width: 2100px) 20vw',
              className: styles['card-bg'],
              style: { filter: !canView ? 'blur(20px)' : 'blur(0px)' }
            }}
            alt="thumb"
            src={thumbUrl || '/leaf.jpg'}
            fallbackSrc="/no-image.jpg"
          />
        </div>
        {!canView && (
          <div className={styles['related-item-block']}>
            <span>
              <AiOutlineLock />
            </span>
          </div>
        )}
      </div>
      <Tooltip title={media?.title || media?.name || media?.text}>
        <div className={styles['related-item-name']}>
          <span>
            {media?.title || media?.name || media?.text}
          </span>
        </div>
      </Tooltip>
    </Link>
  );
}

export default RelatedItem;
