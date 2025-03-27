/* eslint-disable consistent-return */

'use client';

import ReactionButtons from '@components/action-buttons/reaction-buttons';
import PerformerAvatar from '@components/performer/performer-avatar';
import { AiOutlineRightCircle } from 'react-icons/ai';
import CommentWrapper from '@components/comment/comment-wrapper';
import ParticipantMediaList from '@components/participants/participants';
import PurchaseProductBtn from '@components/product/details/purchase-product-btn';
import { IMedia } from '@interfaces/media';
import { Collapse } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useIntl } from 'react-intl';
import style from './content-middle-wrapper.module.scss';

type Props = {
  content: IMedia,
  objectType: 'video' | 'audio' | 'product' | 'photo' | 'text' | 'reel'
};

function ContentMiddleWrapper({
  content,
  objectType
}: Props) {
  const intl = useIntl();
  const performer = content.performer || (content as any).creator;
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);
  const [isActive, setIsActive] = useState(false);
  const [totalLike, setTotalLike] = useState(content?.totalLike || content?.stats?.likes || 0);

  const handelChangeCollapse = (e: string[]) => {
    setIsActive(e.length >= 2);
  };

  const collapseItems = ({
    // eslint-disable-next-line no-shadow, @typescript-eslint/no-unused-vars
    isMobileDevice, isActive, content, intl, handelChangeCollapse
  }) => [
      {
        key: '1',
        label: isMobileDevice ? (
          <div className={style['content-info-collapse-header']}>
            <p>
              {isActive
                ? intl.formatMessage({ id: 'readLess', defaultMessage: 'Read less' })
                : intl.formatMessage({ id: 'readMore', defaultMessage: 'Read more' })}
            </p>
            <AiOutlineRightCircle
              style={{ transform: `rotate(${isActive ? '90deg' : '0'})` }}
            />
          </div>
        ) : null,
        children: (
          <>
            {(content?.title && content?.price && content.type === 'product') && (
              <PurchaseProductBtn product={content} />
            )}
            {content?.participants && <ParticipantMediaList item={content} />}
          </>
        ),
        showArrow: false
      }
    ];

  useEffect(() => {
    if (typeof (window) !== 'undefined') {
      const handleResize = () => {
        // eslint-disable-next-line no-shadow
        const isMobile = window.innerWidth <= 768;
        setIsMobileDevice(isMobile);
        setIsActive(!isMobile);
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <>
      <div className={classNames(
        style['content-act']
      )}
      >
        <div className={style['content-split']}>
          <PerformerAvatar performer={performer} />
          <ReactionButtons
            performer={content.performer}
            objectId={content._id}
            objectType={(content as any).isAd ? 'advertisement' : objectType}
            totalLike={totalLike}
            isLiked={content.isLiked}
            isBookmarked={content.isBookMarked || (content as any).isBookmarked}
            totalComment={content.totalComment || content?.stats?.comments}
            unShowComment
            setDefaultTotalLike={setTotalLike}
          />
        </div>
      </div>
      <div className={style['content-info']}>
        {(content as any).isAd
          && (
            <p className={style['content-info-ad']}>
              {intl.formatMessage({ id: 'advertisement', defaultMessage: 'Advertisement' })}
            </p>
          )}
        <h3 className={style['content-info-title']}>{content.title}</h3>
        {(content as any).name && (content.price) && (
          <p className={style['content-info-price']}>
            €
            {content.price}
          </p>
        )}
        <div className={style['content-info-stas']}>
          <p>
            <span>{totalLike}</span>
            {' '}
            {totalLike > 1 ? intl.formatMessage({ id: 'like', defaultMessage: 'like' }) : intl.formatMessage({ id: 'likes', defaultMessage: 'likes' })}
          </p>
          <p>
            <span>{content?.totalViews || content?.stats?.views}</span>
            {' '}
            {content?.totalViews || content?.stats?.views > 1 ? intl.formatMessage({ id: 'view', defaultMessage: 'view' }) : intl.formatMessage({ id: 'views', defaultMessage: 'views' })}
          </p>
        </div>
        <p className={style['content-info-description']}>{content.description || content.text || 'No description...'}</p>
        {(content as any).redirectLink
          && (
            <div className={style['content-info-redirectLink']}>
              <p>
                <span>{intl.formatMessage({ id: 'redirectLink:', defaultMessage: 'Redirect Link:' })}</span>
              </p>
              <Link href={(content as any).redirectLink} target="blank">{(content as any).redirectLink}</Link>
            </div>
          )}
        {content.tags && content.tags.length > 0 && (
          <div className={style['content-tags']}>
            {content.tags.map((tag) => (
              <a key={tag}>
                #
                {tag || 'tag'}
              </a>
            ))}
          </div>
        )}
        <div className={style['content-info-collapse']}>
          <Collapse
            defaultActiveKey={!isMobileDevice ? ['1'] : ['0']}
            onChange={(e) => handelChangeCollapse(e)}
            items={collapseItems({
              isMobileDevice, isActive, content, intl, handelChangeCollapse
            })}
          />
        </div>
      </div>
      <div className={style['content-comment']}>
        <CommentWrapper
          objectId={content._id}
          objectType={(content as any).isAd ? 'advertisement' : objectType}
          showHead
        />
      </div>
    </>
  );
}

export default ContentMiddleWrapper;
