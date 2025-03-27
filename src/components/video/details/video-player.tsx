'use client';

import { IVideo } from '@interfaces/video';
import { formatDate } from '@lib/date';
import { showError, showSuccess } from '@lib/message';
import { tokenTransactionService } from '@services/token-transaction.service';
import { Button, Spin } from 'antd';
import dynamic from 'next/dynamic';
import {
  useState
} from 'react';
import { useIntl } from 'react-intl';
import { useSession } from 'next-auth/react';
import { IUser } from '@interfaces/user';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './video-player.module.scss';

const VideoSubscribeButtons = dynamic(() => import('@components/video/details/subscribe-button'));
const HtmlVideolayer = dynamic(() => (import('@components/video/player/html-player')));

type Props = {
  video: IVideo;
  onPaymentSuccess?: Function;
};

export default function VideoDetailPlayer({
  video, onPaymentSuccess = () => { }
}: Props) {
  const [isBought, setIsBought] = useState(video.isBought);
  const [requesting, setRequesting] = useState(false);
  const { data: session, update: updateBalance } = useSession();
  const user: IUser = session?.user;
  const thumbUrl = video.thumbnail?.url
    || (video.teaser?.thumbnails && video.teaser?.thumbnails[0])
    || (video?.video?.thumbnails && video?.video?.thumbnails[0])
    || '/leaf.jpg';
  const { isSubscribed } = video;

  const intl = useIntl();
  const viewable = (
    video.isFree
    || (video.isSub && isSubscribed && !video.isSchedule)
    || (video.isSale && isBought && !video.isSchedule))
    || (video as any).isAd;

  const renderTeaser = () => {
    if (!video.teaser) {
      return (
        <div className="video-thumbs">
          <ImageWithFallback
            options={{
              unoptimized: true,
              width: 500,
              height: 500,
              style: { borderRadius: 20, width: '100%' }
            }}
            alt="thumbnail"
            src={thumbUrl}
          />
        </div>
      );
    }

    if (video.teaserProcessing) {
      return (
        <div className="vid-processing">
          <div className="text-center">
            <Spin />
            <br />
            {intl.formatMessage({
              id: 'teaserProcessing',
              defaultMessage: 'Teaser is processing, please wait or comeback later!'
            })}
          </div>
        </div>
      );
    }

    return (
      <HtmlVideolayer
        videoSrc={video.teaser.url}
        videoId={video?._id}
      />
    );
  };

  if (viewable) {
    return (
      <HtmlVideolayer
        videoSrc={video.files[0].url}
        aspectRatio={video.files[0].width && video.files[0].height ? video.files[0].width / video.files[0].height : ''}
        videoId={video?._id}
      />
    );
  }

  return (
    <div className={style['vid-player']}>
      <div className="vid-group">
        {renderTeaser()}
        <div className="vid-exl-group">
          <h3>
            {(() => {
              if (video.isSale && !isBought && !video.isSchedule) {
                return intl.formatMessage({
                  id: 'unlockViewFullContent',
                  defaultMessage: 'Unlock to view full content'
                });
              }
              if (!video.isSale && !isSubscribed && !video.isSchedule) {
                return intl.formatMessage({
                  id: 'subscribeViewFullContent',
                  defaultMessage: 'Subscribe to view full content'
                });
              }
              return intl.formatMessage({
                id: 'videoIsUpcoming',
                defaultMessage: 'Video is upcoming'
              });
            })()}
          </h3>
          <div className="text-center">
            {video.isSale && !isBought && (
              <Button
                block
                className="primary"
                loading={requesting}
                disabled={requesting}
                onClick={async () => {
                  try {
                    if (!user._id) {
                      showError(intl.formatMessage({
                        id: 'pleaseLogIn',
                        defaultMessage: 'Please log in!'
                      }));
                      return;
                    }
                    if (user.isPerformer) {
                      return;
                    }
                    setRequesting(true);
                    const { data } = await tokenTransactionService.purchaseVideo(video._id, {});
                    onPaymentSuccess(data);
                    showSuccess(intl.formatMessage({
                      id: 'videoIsUnlocked',
                      defaultMessage: 'Video is unlocked!'
                    }));
                    updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - Number(video.price) } });
                    setIsBought(true);
                    setRequesting(false);
                    // TODO - reload video
                  } catch (e) {
                    showError(e);
                    setRequesting(false);
                  }
                }}
              >
                {intl.formatMessage({
                  id: 'unlockFor',
                  defaultMessage: `Unlock for  € ${video.price.toFixed(2)}`
                }, { price: `${video.price.toFixed(2)}` })}
              </Button>
            )}
            {!video.isSale && !isSubscribed && !(video as any)?.isAd && (
              <div
                style={{ padding: '0 10px' }}
                className="subscription-btn-grp"
              >
                <VideoSubscribeButtons performer={video.performer || video.performerInfo} />
              </div>
            )}
          </div>
          {video.isSchedule && (
            <h4 style={{ marginTop: 15 }}>
              {intl.formatMessage({
                id: 'videoPremieredOn',
                defaultMessage: `Main video will be premiered on ${formatDate(video.scheduledAt, 'll')}`
              }, {
                scheduledAt: formatDate(video.scheduledAt, 'll')
              })}
            </h4>
          )}
        </div>
      </div>
    </div>
  );
}
