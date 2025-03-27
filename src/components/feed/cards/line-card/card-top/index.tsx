import { IFeed } from '@interfaces/feed';
import Link from 'next/link';
import ImageWithFallback from '@components/common/images/image-fallback';
import { AiOutlineCheck, AiOutlineStar } from 'react-icons/ai';
import FeedCardTime from './card-time';
import DropdownPostTop from './dropdown';

interface IProps {
  feed: IFeed;
  priority: boolean;
}

export default function PostTopCard({ feed, priority }: IProps) {
  const { performer } = feed;
  return (
    <div className="feed-top">
      <Link href={`/${performer?.username}`}>
        <div className="feed-top-left">
          <ImageWithFallback
            options={{
              width: 40,
              height: 40,
              quality: 30,
              sizes: '(max-width: 768px) 20vw, (max-width: 2100px) 10vw',
              className: 'p-avt',
              priority
            }}
            fallbackSrc="/no-avatar.jpg"
            src={performer?.avatar || '/no-avatar.jpg'}
            alt="creator-avatar"
          />
          <div className="feed-name">
            <div className="name">
              <span>{performer?.name || 'N/A'}</span>
              &nbsp;
              {performer?.verifiedAccount && <span><AiOutlineCheck /></span>}
            </div>
            {performer?.isFeatured && <span><AiOutlineStar /></span>}
            <div className="username">
              <span>@</span>
              <span>{performer?.username || 'n/a'}</span>
            </div>
          </div>
          {!performer?.isOnline ? (
            <span className="online-status" />
          ) : (
            <span className="online-status active" />
          )}
        </div>
      </Link>
      <div className="feed-top-right">
        <FeedCardTime date={feed.updatedAt} />
        <DropdownPostTop feed={feed} />
      </div>
    </div>
  );
}
