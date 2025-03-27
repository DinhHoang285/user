import ContentMiddleWrapper from '@components/content/detail/content-middle-wrapper';
import ContentRelatedList from '@components/content/related/related-list';
import { IVideo } from '@interfaces/video';
import { Col, Row } from 'antd';

import { IAdvertisement } from '@interfaces/advertisement';
import dynamic from 'next/dynamic';
import styles from './video-details-wrapper.module.scss';

const VideoDetailPlayer = dynamic(() => import('./video-player'));

type Props = {
  video: IVideo | IAdvertisement
};

export default function VideoDetailsWrapper({
  video
}: Props) {
  return (
    <div className="main-container">
      <Row>
        <Col xs={24} sm={24} md={16} lg={16}>
          <div className={styles['video-player']}>
            <VideoDetailPlayer video={(video as any)} />
          </div>
          <div className={styles['video-info']}>
            <ContentMiddleWrapper objectType="video" content={(video as any)} />
          </div>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <ContentRelatedList excludedId={video._id} type="video" />
        </Col>
      </Row>
    </div>
  );
}
