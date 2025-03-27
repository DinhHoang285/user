import { formatDate } from '@lib/date';

interface IProps {
  date: Date;
}

export default function FeedCardTime({ date }: IProps) {
  return <span className="feed-time">{formatDate(date, 'MMM DD')}</span>;
}
