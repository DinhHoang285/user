'use client';

import { videoService } from '@services/video.service';
import { Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { IVideo } from '@interfaces/video';
import VideoCard from './video-card';

type Props = {
  videoId: string;
  performerId?: string;
  limit?: number;
};

export default function RelatedVideos({
  videoId,
  performerId = '',
  limit = 12
}: Props) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const query = {
        excludedId: videoId,
        limit
      } as any;
      if (performerId) query.performerId = performerId;
      const res = await videoService.userSearch(query);
      setVideos(res.data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [videoId]);

  if (loading) return <div className="text-center"><Spin /></div>;
  if (!videos.length) return <p>No video was found</p>;
  return (
    <Row>
      {videos.length > 0
        ? videos.map((video: IVideo) => (
          <Col xs={12} sm={12} md={6} lg={6} key={video._id}>
            <VideoCard video={video} />
          </Col>
        )) : <p>No video was found</p>}
    </Row>
  );
}
