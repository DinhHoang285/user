import {
  Modal
} from 'antd';
import HtmlVideolayer from '@components/video/player/html-player';
import style from './video-player-view.module.scss';

interface IProps {
  src: string;
  isOpenVideoPlayer: boolean;
  handleCancel: Function;
  title: string;
  width?: number
}
function VideoPlayerViewModal({
  src,
  isOpenVideoPlayer,
  handleCancel,
  title,
  width = 500
}: IProps) {
  if (!isOpenVideoPlayer || !src) return null;
  return (
    <Modal
      title={title}
      open={isOpenVideoPlayer}
      onCancel={() => handleCancel()}
      width={width}
      destroyOnClose
      footer={null}
      centered
      className={style['modal-view-video']}
    >
      <HtmlVideolayer
        videoSrc={src}
        priority={false}
      />
    </Modal>
  );
}

export default VideoPlayerViewModal;
