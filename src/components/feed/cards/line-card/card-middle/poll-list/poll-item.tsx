'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IPoll } from '@interfaces/feed';
import { feedService } from '@services/feed.service';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';

const round = require('lodash/round');

export default function PollItem({ poll, pollExpiredAt, totalVote }: { poll: IPoll; pollExpiredAt: Date; totalVote: number }) {
  const { data } = useSession();
  const [votes, setVotes] = useState(poll.totalVote);
  const percent = totalVote > 0 ? round((votes * 100) / totalVote, 2) : 0;
  const intl = useIntl();

  return (
    <div
      aria-hidden
      className="p-item"
      key={poll._id}
      onClick={async () => {
        // eslint-disable-next-line global-require
        const moment = (await import('moment')).default;
        const isExpired = moment().isAfter(pollExpiredAt);
        if (!data?.user?._id) {
          return;
        }
        if (isExpired) {
          showError(intl.formatMessage({ id: 'thePollIsNowClosed', defaultMessage: 'The poll is now closed' }));
          return;
        }
        try {
          await feedService.votePoll(poll._id);
          setVotes((v) => v + 1);
        } catch (e) {
          showError(e);
        }
      }}
    >
      <span className="progress-bar" style={{ width: `${percent}%` }} />
      <span className="p-desc">{poll.description}</span>
      <span className="total-color">
        {percent}
        %
      </span>
    </div>

  );
}
