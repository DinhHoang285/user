'use client';

import PerformerAvatar from '@components/performer/common/performer-avatar';
import ReactionButtons from '@components/action-buttons/reaction-buttons';
import { IVideo } from '@interfaces/video';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import style from './video-details-wrapper.module.scss';

const VideoTabs = dynamic(() => import('./video-tabs'));
const RelatedVideos = dynamic(() => import('./related-videos'));

type Props = {
  video: IVideo
};

export default function VideoMiddleWrapper({
  video
}: Props) {
  const [activeTab, setActiveTab] = useState('description');

  const onChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className={style['vid-act']}>
        <div className={style['vid-split']}>
          <PerformerAvatar performer={video.performer} />
          <ReactionButtons
            objectId={video._id}
            objectType="video"
            totalLike={video.stats.likes}
            isLiked={video.isLiked}
            isBookmarked={video.isBookmarked}
            totalComment={video.stats.comments}
            onCommentClick={() => setActiveTab('comment')}
            activeComment={activeTab === 'comment'}
            performer={null}
          />
        </div>
      </div>
      <VideoTabs
        video={video}
        activeKey={activeTab}
        onTabChange={(tab) => onChangeTab(tab)}
      />
      <div className={style['related-items']}>
        <h4 className={style['ttl-1']}>You may also like</h4>
        <RelatedVideos videoId={video._id} />
      </div>
    </>
  );
}
