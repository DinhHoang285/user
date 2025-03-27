import { IFeed } from '@interfaces/feed';

export default function PostCardText({ feed }: { feed: IFeed; }) {
  return (
    <div
      className="f-text"
      id={`pt-f-${feed._id}`}
       // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: feed.text }}
    />
  );
}
