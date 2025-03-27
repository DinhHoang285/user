import classNames from 'classnames';
import style from './style.module.scss';

export default function FeedSkeletonCard() {
  return (
    <div className={style['feed-skeleton']}>
      <div className={style['f-top']}>
        <div className={classNames(style['p-avt'], 'skeleton-loading')} />
        <div className={style['f-heading']}>
          <div className={style['h-top']}>
            <div className={style['h-t-left']}>
              <span className={classNames(style['p-name'], 'skeleton-loading')} />
              <span className={classNames(style['follow-btn'], 'skeleton-loading')} />
            </div>
            <div className={style['h-t-right']}>
              <span className={classNames(style['feed-time'], 'skeleton-loading')} />
              <span className={classNames(style['dropdown-options'], 'skeleton-loading')} />
            </div>
          </div>
          <div className={style['f-username']}>
            <div className={classNames(style.username, 'skeleton-loading')} />
          </div>
          <div className={classNames(style['f-content'], 'skeleton-loading')} />
        </div>
      </div>
      <div className={classNames(style['feed-content'], 'skeleton-loading')} />
      <div className={style['f-bot']}>
        <div className={style['feed-actions']}>
          <div className={style['action-item']}>
            <span className={classNames(style['act-btn'], 'skeleton-loading')} />
            <span className={classNames(style['act-btn'], 'skeleton-loading')} />
          </div>
          <div className={style['action-item']}>
            <span className={classNames(style['act-btn'], 'skeleton-loading')} />
          </div>
        </div>
      </div>
    </div>
  );
}
