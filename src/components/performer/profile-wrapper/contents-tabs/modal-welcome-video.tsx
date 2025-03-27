import HtmlVideolayer from '@components/video/player/html-player';
import { IPerformer } from '@interfaces/performer';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  performer: IPerformer;
};

function ModalWelcomeVideo({ performer }: Props) {
  const intl = useIntl();
  const [show, setShow] = useState(false);

  const handleViewWelcomeVideo = () => {
    const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos');
    if (!notShownWelcomeVideos?.includes(performer._id)) {
      const Ids = JSON.parse(notShownWelcomeVideos || '[]');
      const values = Array.isArray(Ids)
        ? Ids.concat([performer._id])
        : [performer._id];
      localStorage.setItem('notShownWelcomeVideos', JSON.stringify(values));
    }
    setShow(false);
  };

  useEffect(() => {
    const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos') || '[]';
    if (!JSON.parse(notShownWelcomeVideos).includes(performer._id)) {
      setShow(true);
    }
  }, [performer]);

  if (!show || !performer.welcomeVideoPath || !performer.activateWelcomeVideo) { return null; }

  return (
    <Modal
      key="welcome-video"
      className="welcome-video"
      destroyOnClose
      closable={false}
      maskClosable={false}
      width={767}
      height={500}
      open
      title={null}
      centered
      onCancel={() => setShow(false)}
      footer={[
        <Button
          key="close"
          className="secondary"
          onClick={() => setShow(false)}
        >
          {intl.formatMessage({ id: 'close', defaultMessage: 'Close' })}
        </Button>,
        <Button
          key="not-show"
          className="primary"
          onClick={() => handleViewWelcomeVideo()}
        >
          {intl.formatMessage({
            id: 'dontShowThisAgain',
            defaultMessage: 'Don\'t show this again'
          })}
        </Button>
      ]}
    >
      <HtmlVideolayer
        videoSrc={performer.welcomeVideoPath}
        priority={false}
      />
    </Modal>
  );
}

export default ModalWelcomeVideo;
