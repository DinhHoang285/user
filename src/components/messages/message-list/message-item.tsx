/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { IMessage, IUser } from '@interfaces/index';
import {
  calculateTimeLeft,
  formatDate,
  formatGiftMessage,
  formatTippedMessage, isExpired, isMediaType, replaceURLs
} from '@lib/index';
import { showError } from '@lib/message';
import { tokenTransactionService } from '@services/index';
import { messageService } from '@services/message.service';
import {
  Avatar,
  Button,
  Dropdown,
  Image
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineEllipsis, AiOutlineKey } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useMessage } from 'src/providers/message.provider';
import { useViewPopup } from 'src/providers/view-media-popup/context';
import ImageWithFallback from '@components/common/images/image-fallback';
import styles from './message-item.module.scss';

const HtmlVideolayer = dynamic(() => import('@components/video/player/html-player'));
const AudioPlayer = dynamic(() => import('@components/video/player/audio-player'));

interface IProps {
  data: IMessage;
  isMine: boolean;
  startsSequence: boolean;
  endsSequence: boolean;
  showTimestamp: boolean;
  currentUser: IUser;
  recipient: IUser;
  isSubscribed: boolean;
  onRemoveMessage: Function;
}

export default function Message({
  data,
  isMine,
  startsSequence,
  endsSequence,
  showTimestamp,
  isSubscribed,
  currentUser,
  recipient,
  onRemoveMessage
}: IProps) {
  const {
    isBought,
    isSale,
    price,
    type,
    text,
    files,
    createdAt,
    _id: messageId,
    senderId,
    timeToExpired
  } = data;
  const { showPopup } = useViewPopup();
  const friendlyTimestamp = moment(createdAt).format('LLLL');
  const intl = useIntl();
  const router = useRouter();
  const { data: session, update: updateBalance } = useSession();
  const { setContentLockerTotal, contentLockerTotal } = useMessage();
  const user: IUser = session?.user as IUser;
  const [bought, setBought] = useState(isSale && isBought);
  const [timeLeft, setTimeLeft] = useState(null);
  const images = files ? files.filter((f) => isMediaType(f, 'image')) : [];
  const video = files && files.find((f) => isMediaType(f, 'video'));
  const teaser = files && files.find((f) => f.type === 'message-teaser');
  const audio = files && files.find((f) => f.type === 'message-audio');
  const thumbnail = files && files.find((f) => f.type === 'message-thumbnail');
  const imageThumb = images[0] && images[0].thumbnails && images[0].thumbnails[0];
  const teaserThumb = teaser?.thumbnails && teaser.thumbnails[0];
  const videoThumb = video?.thumbnails && video.thumbnails[0];
  const canView = (!isSale && isSubscribed)
    || (isSale && bought)
    || senderId === currentUser?._id;

  const thumbUrl = thumbnail?.url
    || (canView
      ? (images && images[0] && images[0]?.url) || videoThumb || teaserThumb
      : imageThumb || videoThumb || teaserThumb)
    || '/leaf.jpg';

  const purchaseMessage = async () => {
    if (user.balance < price) {
      showError(
        intl.formatMessage({
          id: 'yourBalanceIsNotEnough',
          defaultMessage: 'Your balance is not enough'
        })
      );
      router.push('/wallet');
      return;
    }
    if (timeToExpired && isExpired(timeToExpired)) {
      showError(
        intl.formatMessage({
          id: 'expiredCanNotBePurchased',
          defaultMessage: 'Expired can\'t be purchased'
        })
      );
      return;
    }

    try {
      await tokenTransactionService.purchaseMessage(data._id, {});
      setBought(true);
      updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - Number(price) } });
      setContentLockerTotal(contentLockerTotal + 1);
    } catch (e) {
      showError(e);
    }
  };

  const removeMessage = async () => {
    const confirmDelete = intl.formatMessage({
      id: 'confirmDeleteMessage',
      defaultMessage: 'Are you sure you want to delete this message?'
    });
    if (!window.confirm(confirmDelete)) return;
    const resp = await messageService.deleteMessage(data._id);
    const { message: _message } = resp.data;
    onRemoveMessage(_message);
  };

  const menuItems = [
    {
      key: 'delete',
      label: (
        <div
          role="button"
          tabIndex={0}
          onClick={() => removeMessage()}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              removeMessage();
            }
          }}
        >
          {intl.formatMessage({ id: 'delete', defaultMessage: 'Delete' })}
        </div>
      )
    }
  ];

  useEffect(() => {
    setBought(isBought);
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(timeToExpired);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 'Time\'s up!') {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeToExpired]);

  return (
    <div
      id={data._id}
      className={[
        styles.message,
        `${isMine ? styles.mine : ''}`,
        `${startsSequence ? styles.start : ''}`,
        `${endsSequence ? styles.end : ''}`
      ].join(' ')}
    >
      {['photo', 'video'].includes(type) && (
        <div className={styles['bubble-container']}>
          {!isMine && (
            <img
              alt=""
              className={styles.avatar}
              src={recipient?.avatar || '/no-avatar.jpg'}
            />
          )}
          <div
            className={
              ['photo', 'video'].includes(type)
                ? `${styles.bubble} ${styles.media}`
                : styles.bubble
            }
            title={friendlyTimestamp}
          >
            <div
              className={classNames(styles['media-viewer'], {
                [styles.blured]: !(canView || teaser || thumbnail)
              })}
            >
              {!canView && !teaser && (
                <div className={styles.thumbnail}>
                  <Image
                    preview={false}
                    src={thumbUrl}
                    loading="lazy"
                    alt="thumb"
                  />
                </div>
              )}
              {type === 'photo' && canView && (
                <div className={styles['list-photos']}>
                  {images.map((image, idx) => (
                    <ImageWithFallback
                      onClick={() => {
                        showPopup({
                          content: images.map((p) => ({ ...p, type: 'photo' })),
                          index: idx
                        });
                      }}
                      key={image._id}
                      options={{
                        unoptimized: true,
                        quality: 80,
                        width: 200,
                        height: 200,
                        className: styles['photo-img']
                      }}
                      alt="gallery-photo"
                      fallbackSrc="/no-image.jpg"
                      src={image.url}
                    />
                  ))}
                </div>
              )}
              {type === 'video' && canView && (
                <div>
                  {
                    !video ? (
                      <div style={{ color: 'red' }}>
                        {intl.formatMessage({
                          id: 'videoNotFound',
                          defaultMessage: 'Sorry, video was deleted or error.'
                        })}
                      </div>
                    ) : (
                      <HtmlVideolayer
                        videoSrc={video.url}
                        videoId={video._id}
                        thumbUrl={video.thumbnails && video.thumbnails[0]}
                        priority={false}
                        aspectRatio={video.width && video.height ? video.width / video.height : ''}
                      />
                    )
                  }
                </div>
              )}
              {
                !canView && teaser && (
                  <HtmlVideolayer
                    videoSrc={teaser.url}
                    videoId={teaser._id}
                    thumbUrl={teaser.thumbnails && teaser.thumbnails[0]}
                    priority={false}
                    aspectRatio={teaser.width && teaser.height ? teaser.width / teaser.height : ''}
                  />
                )
              }
              {
                !canView && !teaser && !thumbnail && (
                  <span className={styles['lock-ico']}>
                    <AiOutlineKey />
                  </span>
                )
              }
            </div>
            <div className={styles['ms-stats']}>
              <span>
                {type === 'photo' ? intl.formatMessage({
                  id: 'galleryComplete',
                  defaultMessage: 'Gallery complete'
                }) : intl.formatMessage({
                  id: 'videoComplete',
                  defaultMessage: 'Video complete'
                })}
              </span>
            </div>
            {audio && <AudioPlayer url={audio?.url} />}
            <div
              className={styles.txt}
              dangerouslySetInnerHTML={{ __html: replaceURLs(text, intl) }}
            />
            {timeToExpired && timeLeft && !bought && !user.isPerformer && <p className={styles['expired-time']}>{timeLeft}</p>}
            {timeToExpired && timeLeft && user.isPerformer && (
              <p className={styles['expired-time']}>
                {intl.formatMessage({
                  id: 'expiredAt',
                  defaultMessage: 'Expired at:'
                })}
                <span>{formatDate(new Date(timeToExpired), 'DD/MM/YYYY hh:mm A')}</span>
              </p>
            )}
            {isSale && !bought && !isMine && (
              <Button
                block
                className="primary"
                onClick={() => purchaseMessage()}
                disabled={timeToExpired && !!isExpired(timeToExpired)}
                style={{ marginBottom: '8px' }}
              >
                {
                  timeToExpired && timeLeft?.includes('Expired!') ? intl.formatMessage({
                    id: 'expiredCanNotBePurchased',
                    defaultMessage: 'Expired can\'t be purchased!'
                  })
                    : intl.formatMessage({
                      id: 'unlockForMessage',
                      defaultMessage: `Unlock for €${price}`
                    }, { price })
                }
              </Button>
            )}
            {!isSale && !isSubscribed && (
              <Button
                block
                className="primary"
                onClick={() => router.push(`/${recipient?.username || recipient?._id}`)}
              >
                {intl.formatMessage({
                  id: 'toSign',
                  defaultMessage: 'TO SIGN'
                })}
              </Button>
            )}
            {isMine && !data.isDeleted && (
              <Dropdown
                className={styles['remove-icon']}
                menu={{ items: menuItems }}
                placement="bottom"
                trigger={['click']}
              >
                <a>
                  <AiOutlineEllipsis style={{ transform: 'rotate(90deg)' }} />
                </a>
              </Dropdown>
            )}
          </div>
          {isMine && (
            <Avatar
              alt="avatar"
              className={styles.avatar}
              src={currentUser?.avatar || '/no-avatar.jpg'}
            />
          )}
        </div>
      )}
      {type === 'text' && (
        <div className={styles['bubble-container']}>
          {!isMine && (
            <Avatar
              alt="avatar"
              className={styles.avatar}
              src={recipient?.avatar || '/no-avatar.jpg'}
            />
          )}
          <div className={styles.bubble} title={friendlyTimestamp}>
            <div dangerouslySetInnerHTML={{ __html: text }} />
            {audio && <AudioPlayer url={audio?.url} />}
            {isMine && !data.isDeleted && (
              <Dropdown
                className={styles['remove-icon']}
                menu={{ items: menuItems }}
                placement="bottom"
                trigger={['click']}
              >
                <a>
                  <AiOutlineEllipsis style={{ transform: 'rotate(90deg)' }} />
                </a>
              </Dropdown>
            )}
          </div>
          {isMine && (
            <Avatar
              alt=""
              src={currentUser?.avatar || '/no-avatar.jpg'}
              className={styles.avatar}
            />
          )}
        </div>
      )}
      {text && type === 'broadcast' && (
        <div className={styles['bubble-container']}>
          <div className={styles.bubble + styles.custom} title={friendlyTimestamp}>
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        </div>
      )}
      {type === 'tip' && (
        <div className={styles['bubble-container']}>
          <div className={styles.tipped} title={friendlyTimestamp}>
            <div dangerouslySetInnerHTML={{ __html: formatTippedMessage(text, (user as IUser), intl) }} />
          </div>
        </div>
      )}
      {type === 'gift' && (
        <div className={styles['bubble-container']}>
          <div className={styles.gift}>
            {files && files.length > 0 && (
              <img
                alt=""
                className={styles['gift-image']}
                src={files[0]?.url}
              />
            )}
            <div className={styles['gift-title']}>
              {formatGiftMessage(text, (user as IUser), intl)}
            </div>
          </div>
        </div>
      )}
      {showTimestamp && (
        <div className={styles.timestamp}>{friendlyTimestamp}</div>
      )}
    </div>
  );
}
