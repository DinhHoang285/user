'use client';

import { AiOutlineClose, AiOutlineSearch, AiOutlineAppstore } from 'react-icons/ai';
import PurchasedContentTabs from '@components/performer/tabs/purchasedContentTab';
import { Input } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import PerformerPurchasedList from '@components/performer/list/performer-purchased-list';
import style from './purchased-content.module.scss';

export default function PurchasedContentWrapper() {
  const intl = useIntl();
  const [activePer, setActivePer] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [isGrid, setIsGrid] = useState(false);
  const [type, setType] = useState('');
  const [keyword, setKeyword] = useState('');

  const onChangePerformer = debounce((_id: string) => {
    setActivePer(activePer === _id ? '' : _id);
  }, 300);

  const onSearchFeed = debounce((value: string) => {
    setKeyword(value);
  }, 600);

  return (
    <div className={style.content}>
      <PerformerPurchasedList
        activePer={activePer}
        onChangePer={onChangePerformer}
      />

      <div className={classNames(style['bookmark-heading'])}>
        <div className={style['left-side']}>
          <h3>
            {intl.formatMessage({ id: 'mypurchased', defaultMessage: 'MY PURCHASED' })}
          </h3>
        </div>
        <div className={style['right-side']}>
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
                style={{
                  color: isGrid ? 'var(--electric-blue)' : '',
                  height: '25px',
                  width: '25px'
                }}
              />
            </span>
          </div>

          <div className={style['actions-btn-search']}>
            <Input
              className={openSearch ? style.active : ''}
              prefix={(
                <span>
                  <AiOutlineSearch
                    style={{
                      color: isGrid ? 'var(--electric-blue)' : '',
                      height: '25px',
                      width: '25px'
                    }}
                  />
                </span>
              )}
              placeholder={intl.formatMessage({
                id: 'typeToSearchHere',
                defaultMessage: 'Type to search here ...'
              })}
              onChange={(e) => {
                e.persist();
                onSearchFeed(e.target.value);
              }}
            />
            <a
              aria-hidden
              className={style['open-search']}
              onClick={() => setOpenSearch(!openSearch)}
            >
              <span>
                {!openSearch ? (
                  <AiOutlineSearch
                    style={{
                      color: isGrid ? 'var(--electric-blue)' : '',
                      height: '25px',
                      width: '25px'
                    }}
                  />
                ) : (
                  <AiOutlineClose
                    style={{
                      color: isGrid ? 'var(--electric-blue)' : '',
                      height: '25px',
                      width: '25px'
                    }}
                  />
                )}
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className={style['bookmark-header-bottom']}>
        <button
          type="button"
          className={classNames(style['purchase-btn'], {
            [style.active]: type === ''
          })}
          onClick={() => setType('')}
        >
          {intl.formatMessage({ id: 'allPosts', defaultMessage: 'All Posts' })}
        </button>

        <button
          type="button"
          className={classNames(style['purchase-btn'], {
            [style.active]: type === 'photo'
          })}
          onClick={() => setType('photo')}
        >
          {intl.formatMessage({ id: 'photo', defaultMessage: 'Photo' })}
        </button>

        <button
          type="button"
          className={classNames(style['purchase-btn'], {
            [style.active]: type === 'video'
          })}
          onClick={() => setType('video')}
        >
          {intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}
        </button>
        <button
          type="button"
          className={classNames(style['purchase-btn'], {
            [style.active]: type === 'audio'
          })}
          onClick={() => setType('audio')}
        >
          {intl.formatMessage({ id: 'audio', defaultMessage: 'Audio' })}
        </button>
      </div>

      <div className={style['user-account']}>
        <PurchasedContentTabs
          type={type}
          isGrid={isGrid}
          activePer={activePer}
          keyword={keyword}
        />
      </div>
    </div>
  );
}
