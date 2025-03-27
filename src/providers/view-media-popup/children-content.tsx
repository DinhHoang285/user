'use client';

/* eslint-disable no-nested-ternary */
import Video from 'yet-another-react-lightbox/plugins/video';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Download from 'yet-another-react-lightbox/plugins/download';
import { convertHtml } from '@lib/string';
import ImageLightBox from './image-light-box';
import style from './view-media-popup-children.module.scss';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

type P = {
  show: boolean;
  closePopup: Function;
  content: any;
  index: number;
};

export default function MediaChildrenContent({
  show, closePopup, content, index
}: P) {
  const slides = content.map((d: any) => ((d.type || d.mimeType).includes('photo') || (d.type || d.mimeType).includes('image') ? (
    {
      type: 'image',
      src: d.url, // get file photo
      width: d.width || 1024,
      height: d.height || 1024,
      // title: d?.title || '',
      description: convertHtml(d.description || ''),
      alt: 'photo',
      imageFit: 'contain'
    }
  ) : ((d.type || d.mimeType).includes('video') ? ( // get file video
    {
      type: 'video',
      width: d?.width || 1920,
      height: d?.height || 1080,
      autoPlay: true,
      disablePictureInPicture: true,
      controls: true,
      // title: d?.title || '',
      description: convertHtml(d?.description || ''),
      poster: (d?.thumbnails && d?.thumbnails[0]),
      sources: [
        {
          src: d.url,
          type: 'video/mp4'
        }
      ]
    }
  ) : null)));

  return (
    <Lightbox
      open={show}
      index={index}
      close={closePopup.bind(this)}
      slides={slides}
      render={{
        slide: ImageLightBox,
        buttonPrev: content.length > 1 ? undefined : () => null,
        buttonNext: content.length > 1 ? undefined : () => null
      }}
      plugins={[
        Zoom, Thumbnails, Captions, Counter, Download, Fullscreen, Video
      ]}
      animation={{ zoom: 1000 }}
      zoom={{
        maxZoomPixelRatio: 100,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        keyboardMoveDistance: 50,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
        scrollToZoom: true
      }}
      captions={{
        showToggle: false,
        descriptionTextAlign: 'center',
        descriptionMaxLines: 2
      }}
      carousel={{ preload: slides.length > 3 ? 2 : 1 }}
      thumbnails={{
        position: 'bottom',
        width: 120,
        height: 80
      }}
      className={`${style['lb-pup']} ${style[`popup-${slides.length}-item`]}`}
    />
  );
}
