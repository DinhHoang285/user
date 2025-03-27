'use client';

/* eslint-disable no-nested-ternary */
import { AiOutlineTag } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IVideo } from '@interfaces/video';
import { IGallery } from '@interfaces/gallery';
import { IProduct } from '@interfaces/product';
import { Spin } from 'antd';
import { feedService } from '@services/feed.service';
import styles from './releted.module.scss';
import RelatedItem from './related-item';

interface IProps {
  excludedId: string;
  type: 'video' | 'reel' | 'product' | 'photo' | 'text' | 'audio',
  performerId?: string;
  limit?: number;
  defaultContent?: IVideo[] | IGallery[] | IProduct[],
  noLoad?: boolean,
  status?: 'active' | 'unactive' | undefined
}

function ContentRelatedList({
  excludedId,
  performerId = '',
  limit = 12,
  type,
  defaultContent = [],
  noLoad = false,
  status = 'active'
}: IProps) {
  const [contents, setContents] = useState<IVideo[] | IGallery[] | IProduct[]>(defaultContent || []);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const loadContents = async () => {
    if (!noLoad) {
      try {
        setLoading(true);
        const query = {
          excludedId,
          limit,
          status,
          performerId,
          type
        } as any;

        const res = await feedService.userSearch(query);

        setContents(res.data.data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadContents();
  }, [excludedId]);

  if (loading) return <div className="text-center"><Spin /></div>;

  return (
    <div className={styles['content-related']}>
      <header className={styles['content-related-header']}>
        <span>
          <h4>{intl.formatMessage({ id: 'youMayAlsoLike', defaultMessage: 'You May Also Like' })}</h4>
          <p><AiOutlineTag /></p>
        </span>
      </header>
      <main className={styles['content-related-main']}>
        {
          !contents.length ? (
            <p>
              {intl.formatMessage({
                id: 'noDataFound',
                defaultMessage: 'No data was found'
              })}
            </p>
          )
            : (
              <div className={styles['content-related-list']}>
                {
                  contents.map((item) => (<RelatedItem key={item._id} media={item} />))
                }
              </div>
            )
        }
      </main>
    </div>
  );
}

export default ContentRelatedList;
