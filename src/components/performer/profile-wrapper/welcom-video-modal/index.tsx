'use client';

import { IPerformer } from '@interfaces/performer';
import { Modal } from 'antd';

type Props = {
  performer: IPerformer;
  onClose: Function;
};

export default function ModalWelcomeVideo({
  performer, onClose
}: Props) {
  return (
    <Modal
      className="welcome-video"
      width={1200}
      open
      title={null}
      onClose={() => onClose()}
      footer={(
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          <button
            type="button"
            key="close"
            className="ant-btn secondary"
            onClick={() => onClose()}
          >
            Close
          </button>
          <button
            key="not-show"
            type="button"
            className="ant-btn primary"
            onClick={() => {
              const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos');
              if (!notShownWelcomeVideos?.includes(performer._id)) {
                const Ids = JSON.parse(notShownWelcomeVideos || '[]');
                const values = Array.isArray(Ids) ? Ids.concat([performer._id]) : [performer._id];
                localStorage.setItem('notShownWelcomeVideos', JSON.stringify(values));
              }
              onClose();
            }}
          >
            Don&apos;t show this again
          </button>
        </div>
      )}
    >
      <video width="100%" height="650px" controls>
        <source src={performer?.welcomeVideoPath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Modal>
  );
}
