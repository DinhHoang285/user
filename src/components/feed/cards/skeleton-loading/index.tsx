import { FEED_LIMIT } from 'src/constants';
import FeedSkeleton from './skeleton-card';

// TOTO - recalculate length once feed limit has changed
export default function FeedSkeletonLoading() {
  return (
    <div style={{
      margin: '30px auto',
      maxWidth: 540,
      marginBottom: 45
    }}
    >
      {Array.from({ length: FEED_LIMIT }).map((_, i) => <FeedSkeleton key={`skeleton_loading_${i + 1}`} />)}
    </div>
  );
}
