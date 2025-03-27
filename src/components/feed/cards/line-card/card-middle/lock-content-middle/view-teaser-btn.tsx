import { IFile } from '@interfaces/file';
import { useState } from 'react';
import { Modal } from 'antd';

type IProps = {
  teaser: IFile
}

export default function ViewTeaserBtn({
  teaser
}: IProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-hidden
        onClick={() => setOpenModal(true)}
      >
        <span style={{ color: '#48DA89' }}>#</span>
        See preview
      </button>
      {openModal && (
        <Modal
          key="teaser_video"
          title="Teaser video"
          open={openModal}
          footer={null}
          onClose={() => setOpenModal(false)}
          width={1200}
        >
          <video width="100%" height="650px" controls>
            <source src={teaser?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Modal>
      )}
    </>
  );
}
