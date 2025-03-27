import HtmlVideolayer from '@components/video/player/html-player';
import { IFile } from '@interfaces/file';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

type IProps = {
  teaser: IFile;
};

function ViewTeaserBtn({ teaser }: IProps) {
  const intl = useIntl();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        className="teaser-btn"
        type="link"
        onClick={() => setOpenModal(true)}
      >
        {intl.formatMessage({
          id: 'viewTeaser',
          defaultMessage: 'View teaser'
        })}
      </Button>
      {openModal && (
        <Modal
          key="teaser_video"
          title={intl.formatMessage({
            id: 'teaserVideo',
            defaultMessage: 'Teaser video'
          })}
          open={openModal}
          footer={null}
          onCancel={() => setOpenModal(false)}
          width={650}
          destroyOnClose
          className="modal-teaser-preview"
        >
          <HtmlVideolayer
            videoSrc={teaser.url}
          />
        </Modal>
      )}
    </>
  );
}

export default ViewTeaserBtn;
