'use client';

import { IFeed } from '@interfaces/feed';
import style from './style.module.scss';
import PollItem from './poll-item';
import PollCountdown from './poll-count-down';

interface Props {
  feed: IFeed;
}

export default function PollsList({ feed }: Props) {
  // const { translate } = useMainThemeLayout();
  if (!feed?.polls?.length) return null;
  let totalVote = 0;
  feed.polls.forEach((poll) => {
    totalVote += poll.totalVote;
  });

  // don't have css in this file
  return (
    <div className={style['feed-polls']}>
      {feed.pollDescription && <h4 className="p-question">{feed.pollDescription}</h4>}
      {feed.polls.map((poll) => (
        <PollItem poll={poll} key={poll._id} pollExpiredAt={feed.pollExpiredAt} totalVote={totalVote} />
      ))}
      <div className="total-vote">
        <span>
          Total
          {' '}
          {totalVote}
          {' '}
          {totalVote < 2 ? 'vote' : 'votes'}
        </span>
        <PollCountdown date={feed.pollExpiredAt} />
      </div>
    </div>
  );
}
