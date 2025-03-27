import { IStaticPost } from '@interfaces/post';
import PageHeading from '@components/common/page-heading';
import style from './style.module.scss';

export default function StaticPostWrapper({ post }: { post: IStaticPost }) {
  return (
    <div className={style['page-container']}>
      <PageHeading title={post.title} />
      <div
        className="page-content"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
