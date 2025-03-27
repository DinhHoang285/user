'use client';

import ContentMiddleWrapper from '@components/content/detail/content-middle-wrapper';
import ContentRelatedList from '@components/content/related/related-list';
import { Col, Row } from 'antd';

import { IAdvertisement } from '@interfaces/advertisement';
import { IFeed } from '@interfaces/feed';
import FeedContent from '@components/feed/detail/feed-content';
import styles from './feed-detail-wrapper.module.scss';

type Props = {
  feed: IFeed | IAdvertisement
};

function FeedDetailWrapper({
  feed
}: Props) {
  return (
    <div className="main-container">
      <Row>
        <Col xs={24} sm={24} md={16} lg={16}>
          <div className={styles['feed-player']}>
            <FeedContent feed={feed as IFeed} />
          </div>
          <div className={styles['feed-info']}>
            <ContentMiddleWrapper objectType={feed.type as any} content={(feed as IFeed)} />
          </div>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <ContentRelatedList
            excludedId={feed._id}
            type={feed.type as 'audio' | 'video' | 'text' | 'reel' | 'product' | 'photo'}
          />
        </Col>
      </Row>
    </div>
  );
}

export default FeedDetailWrapper;
