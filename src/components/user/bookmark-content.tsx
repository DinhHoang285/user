'use client';

import { AiOutlineAppstore } from 'react-icons/ai';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import PerformerBookmarkList from '@components/performer/list/performer-bookmark-list';
import BookmarkTabs from '@components/user/bookmark-wrapper';
import style from './bookmark-context.module.scss';

export default function FavoriteVideoContent() {
  const intl = useIntl();
  const [activePer, setActivePer] = useState('');
  const [isGrid, setIsGrid] = useState(false);
  const [type, setType] = useState('');

  const onChangePerformer = debounce(async (_id) => {
    setActivePer(activePer === _id ? '' : _id);
  }, 300);

  return (
    <div className={style.content}>
      <PerformerBookmarkList activePer={activePer} onChangePer={onChangePerformer} />

      <div className={style['bookmark-heading']}>
        <div className={style['left-side']}>
          <h3>
            {intl.formatMessage({
              id: 'mybookmarks',
              defaultMessage: 'MY BOOKMARKS'
            })}
          </h3>
        </div>
        <div
          className={style['actions-btn-grid']}
          role="button"
          tabIndex={0}
          onClick={() => setIsGrid(!isGrid)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsGrid(!isGrid);
            }
          }}
        >
          <span>
            <AiOutlineAppstore
              style={{ color: isGrid ? 'var(--electric-blue)' : '', height: '30px', width: '30px' }}
            />
          </span>
        </div>
      </div>

      <div className={style['bookmark-header-bottom']}>
        <button
          type="button"
          className={classNames(style['bookmark-btn'], {
            [style.active]: type === ''
          })}
          onClick={() => setType('')}
        >
          {intl.formatMessage({ id: 'allPosts', defaultMessage: 'All Posts' })}
        </button>

        <button
          type="button"
          className={classNames(style['bookmark-btn'], {
            [style.active]: type === 'text'
          })}
          onClick={() => setType('text')}
        >
          {intl.formatMessage({ id: 'text', defaultMessage: 'Text' })}
        </button>

        <button
          type="button"
          className={classNames(style['bookmark-btn'], {
            [style.active]: type === 'video'
          })}
          onClick={() => setType('video')}
        >
          {intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}
        </button>

        <button
          type="button"
          className={classNames(style['bookmark-btn'], {
            [style.active]: type === 'photo'
          })}
          onClick={() => setType('photo')}
        >
          {intl.formatMessage({ id: 'photos', defaultMessage: 'Photos' })}
        </button>

        <button
          type="button"
          className={classNames(style['bookmark-btn'], {
            [style.active]: type === 'audio'
          })}
          onClick={() => setType('audio')}
        >
          {intl.formatMessage({ id: 'audio', defaultMessage: 'Audio' })}
        </button>

        <button
          type="button"
          className={classNames(style['bookmark-btn'], {
            [style.active]: type === 'product'
          })}
          onClick={() => setType('product')}
        >
          {intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}
        </button>
      </div>

      <div className={style['user-account']}>
        <BookmarkTabs type={type} isGrid={isGrid} activePer={activePer} />
      </div>
    </div>
  );
}
