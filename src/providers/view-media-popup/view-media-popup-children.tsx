/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import dynamic from 'next/dynamic';
import { useViewPopup } from './context';

const MediaChildrenContent = dynamic(() => import('./children-content'));

function ViewMediaPopupChildren() {
  const {
    show, closePopup, content, index
  } = useViewPopup();

  return (
    <>
      {show && content && content.length ? (
        <MediaChildrenContent
          closePopup={closePopup}
          content={content}
          index={index}
          show={show}
        />
      ) : null}
    </>
  );
}

export default ViewMediaPopupChildren;
