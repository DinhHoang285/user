import CommentWrapper from '@components/comment/comment-wrapper';
import UserActionsGroup from '@components/performer/profile-wrapper/contents-tabs/user-actions-group';
import { IFeed } from '@interfaces/feed';
import { IPerformer } from '@interfaces/performer';
import { replaceURLs } from '@lib/string';
import Link from 'next/link';
import { AiOutlineCheck, AiOutlineClose, AiOutlineStar } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import style from './index.module.scss';
import ScrollListReels from './scroll-list';

interface IProps {
  performer: IPerformer,
  reel: IFeed,
  openComment: boolean,
  onCloseComment: any,
  onClickCloseProfile: any,
}

function ModelBox({
  performer, reel, openComment, onCloseComment, onClickCloseProfile
}: IProps) {
  const intl = useIntl();

  return (
    <div className={style['model-wrapper']}>
      <div className={style['model-header']}>
        <img
          className={style['model-banner']}
          src={performer?.cover || '/default-banner.jpeg'}
          alt={intl.formatMessage({ id: 'coverAlt', defaultMessage: 'Cover Banner' })}
        />
        <button type="button" className={style['model-toggle']} onClick={onClickCloseProfile}>
          <span><AiOutlineClose /></span>
        </button>
        <div className={style['model-info']}>
          <div className={style['model-info-header']}>
            <div className={style['model-info-avatar']}>
              <img
                src={performer?.avatar || '/no-avatar.jpg'}
                alt={intl.formatMessage({ id: 'avatarAlt', defaultMessage: 'Avatar' })}
              />
              {performer?.isOnline > 0 && <div />}
            </div>
            <div className={style['model-info-actions']}>
              <UserActionsGroup performer={performer} unShare />
            </div>
          </div>
          <div className={style['model-info-list']}>
            <p className={style['model-info-name']}>
              <span>
                {performer?.name || intl.formatMessage({ id: 'notAvailable', defaultMessage: 'N/A' })}
              </span>
            </p>
            <p className={style['model-info-user']}>
              <span>
                {`@${performer?.username || intl.formatMessage({ id: 'notAvailable', defaultMessage: 'n/a' })}`}
              </span>
              &nbsp;
              {performer?.verifiedAccount && <span><AiOutlineCheck /></span>}
              &nbsp;
              {performer?.isFeatured && <span><AiOutlineStar /></span>}
            </p>
            <div className={style['model-info-stas']}>
              <p className={style['model-stas-item']}>
                <span>{performer?.stats.followers}</span>
                <span>
                  {' '}
                  {intl.formatMessage({ id: 'followers', defaultMessage: 'Followers' })}
                </span>
              </p>
              <p className={style['model-stas-item']}>
                <span>{performer?.stats.subscribers}</span>
                <span>
                  {' '}
                  {intl.formatMessage({ id: 'subscribers', defaultMessage: 'Subscribers' })}
                </span>
              </p>
            </div>
            <div
              className={style['model-info-bio']}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: replaceURLs(
                  performer?.bio || intl.formatMessage({ id: 'noBioYet', defaultMessage: 'No Bio Yet!' }),
                  intl
                )
              }}
            />
          </div>
        </div>
      </div>
      <div className={style['model-main']}>
        <Link href={`/${performer?.username || performer?._id}`} className={style['model-profile']}>
          <span>
            {intl.formatMessage({ id: 'viewProfile', defaultMessage: 'View Profile' })}
          </span>
        </Link>
      </div>
      <div className={style['model-footer']}>
        {openComment ? (
          <div className={style['comment-box']}>
            <main className={style['comment-box-main']}>
              <CommentWrapper
                objectType="reels"
                objectId={reel._id}
                showHead
                showClose
                onClickClose={onCloseComment}
              />
            </main>
          </div>
        ) : (
          <ScrollListReels query={{ performerId: performer._id }} />
        )}
      </div>
    </div>
  );
}

export default ModelBox;
