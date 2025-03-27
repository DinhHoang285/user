'use client';

import { IFeed } from '@interfaces/feed';
import { IUser } from '@interfaces/user';
import { showError } from '@lib/message';
import { shortenLargeNumber } from '@lib/number';
import { feedService } from '@services/feed.service';
import classNames from 'classnames';
import { round } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { AiOutlineBarChart } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import style from './post-polls-list.module.scss';
import CountdownTimer from './count-down-timer';

interface IProps {
  feed: IFeed;
  user: IUser | null;
}

export default function Polls({ feed, user }: IProps) {
  if (!feed?.polls || !feed?.polls.length) return null;
  const intl = useIntl();
  const [polls, setPolls] = useState<any>(feed?.polls || []);

  const votePoll = async (poll: any) => {
    const isExpired = moment().isAfter(feed?.pollExpiredAt);
    if (!user || !user._id) {
      showError(
        intl.formatMessage({
          id: 'pleaseLoginOrRegister',
          defaultMessage: 'Please login or register!'
        })
      );
      return;
    }
    if (isExpired) {
      showError(
        intl.formatMessage({
          id: 'thePollIsNowClosed',
          defaultMessage: 'The poll is now closed'
        })
      );
      return;
    }
    try {
      await feedService.votePoll(poll._id);
      const index = polls.findIndex((p) => p._id === poll._id);
      setPolls((prevPolls) => {
        const newItems = [...prevPolls];
        newItems[index].totalVote += 1;
        return newItems;
      });
    } catch (e) {
      showError(e);
    }
  };

  let totalVote = 0;
  polls.forEach((poll) => {
    totalVote += poll.totalVote;
  });

  const convertVotePercent = (vote: number) => (totalVote > 0 ? round((vote * 100) / totalVote, 2) : 0);

  return (
    <div className={classNames(style['feed-polls'])}>
      {feed.pollDescription && (
        <div className={style['p-question']}>
          <span>
            <AiOutlineBarChart />
            {feed.pollDescription}
          </span>
        </div>
      )}
      {polls.map((poll) => (
        <div
          aria-hidden
          className={style['p-item']}
          key={poll._id}
          onClick={() => votePoll(poll)}
        >
          <span
            className={style.progress}
            style={{ width: `${convertVotePercent(poll?.totalVote) || 0}%` }}
          />
          <span className={style['p-desc']}>{poll?.description}</span>
          <span className={style['p-voted']}>{poll?.totalVote || 0}</span>
        </div>
      ))}
      <div className={style['total-vote']}>
        <span>
          {intl.formatMessage({
            id: 'total',
            defaultMessage: 'Total'
          })}
          :
          {' '}
          {shortenLargeNumber(totalVote)}
          {' '}
          {totalVote < 2
            ? intl.formatMessage({
              id: 'vote',
              defaultMessage: 'VOTE'
            })
            : intl.formatMessage({
              id: 'votes',
              defaultMessage: 'VOTES'
            })}
        </span>
        {feed.pollExpiredAt && moment(feed.pollExpiredAt).isAfter(moment()) ? (
          <span>
            {`${moment(feed.pollExpiredAt).diff(moment(), 'days')}d `}
            <CountdownTimer pollExpiredAt={feed.pollExpiredAt} />
          </span>
        ) : (
          <span>
            {intl.formatMessage({
              id: 'closed',
              defaultMessage: 'Closed'
            })}
          </span>
        )}
      </div>
    </div>
  );
}
