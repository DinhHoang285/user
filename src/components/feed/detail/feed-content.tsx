'use client';

import { IFeed } from '@interfaces/feed';
import { feedService } from '@services/feed.service';
import {
  useContext, useEffect, useRef, useState
} from 'react';
import { InView } from 'react-intersection-observer';
import { IUser } from '@interfaces/user';
import { useSession } from 'next-auth/react';
import { SocketContext } from 'src/socket';
import ViewMediaPopupContainer from 'src/providers/view-media-popup/provider';
import style from './feed-content.module.scss';
import Polls from '../cards/card-container/post-polls-list';
import PostCardMiddle from '../cards/line-card/card-middle';

type Props = {
  feed: IFeed;
};

function FeedContent({
  feed
}: Props) {
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const { socket } = useContext(SocketContext);
  const [isBought, setIsBought] = useState(feed.isBought);
  const init = useRef(false);

  const onView = async (inView: boolean) => {
    if (inView && feed._id) await feedService.views(feed._id);
  };

  const onPaymentSuccess = ({ item }) => {
    // TODO refetch url video if S3
    if (!item || item._id !== feed._id || isBought) return;
    setIsBought(true);
  };

  useEffect(() => {
    if (!init.current && socket) {
      socket.on('token_transaction_success', onPaymentSuccess);
      init.current = true;
    }
    return () => {
      socket && socket.off('token_transaction_success', onPaymentSuccess);
    };
  }, [socket]);

  return (
    <InView
      onChange={onView}
    >
      <div className={style['feed-container']}>
        {feed?.polls?.length > 0 && <Polls feed={feed} user={user} />}
        {feed.type !== 'text' && (
          <ViewMediaPopupContainer>
            <PostCardMiddle feed={feed} priority />
          </ViewMediaPopupContainer>
        )}
      </div>
    </InView>
  );
}

export default FeedContent;
