'use client';

import { IUser } from '@interfaces/user';
import { Alert, Input } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AiOutlineClose, AiOutlinePauseCircle, AiOutlinePlayCircle, AiOutlineSearch
} from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import ScrollListMedia from '@components/media/list/scroll-list';
import PerformerFollowListing from '@components/performer/list/follow-listing-swiper';
import SuggestionPerformerListing from '@components/performer/list/suggestion';
import Footer from '@layouts/footer';
import style from './style.module.scss';

function FeedContainer() {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;
  const { settings, autoPlayVideo, setAutoPlayVideo } = useMainThemeLayout();

  const [keyword, setKeyword] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [type, setType] = useState('');
  const [activePer, setActivePer] = useState('');

  const onSearchFeed = debounce(async (e) => setKeyword(e), 600);

  const onChangePerformer = debounce(async (_id) => {
    if (_id.toString() === activePer.toString()) {
      setActivePer('');
    } else {
      setActivePer(_id);
    }
  }, 300);

  useEffect(() => {
    setAutoPlayVideo({ autoPlayBtn: 'off' });
  }, [type]);

  return (
    <div className={classNames(style['home-page'], 'main-container')}>
      <PerformerFollowListing activePer={activePer} onChangePer={onChangePerformer} />
      <div className={`${style['home-heading']}`}>
        <div className={style['left-side']}>
          <h3>
            {intl.formatMessage({ id: 'feed', defaultMessage: 'FEEDS' })}
          </h3>
        </div>
        <div className={style['search-bar-feed']}>
          <Input
            className={openSearch ? style.active : ''}
            prefix={<AiOutlineSearch />}
            placeholder={intl.formatMessage({ id: 'typeToSearchHere', defaultMessage: 'Type to search here ...' })}
            onChange={(e) => {
              e.persist();
              onSearchFeed(e.target.value);
            }}
          />
          {!openSearch && type === 'video' && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <span
              onClick={() => {
                if (autoPlayVideo.autoPlayBtn === 'off') {
                  setAutoPlayVideo({ autoPlayBtn: 'on' });
                } else {
                  setAutoPlayVideo({ autoPlayBtn: 'off' });
                }
              }}
              className={style['button-play']}
            >
              {autoPlayVideo.autoPlayBtn === 'on'
                ? <AiOutlinePauseCircle />
                : <AiOutlinePlayCircle />}
            </span>
          )}
          <a aria-hidden className={style['open-search']} onClick={() => setOpenSearch(!openSearch)}>
            {!openSearch ? <AiOutlineSearch style={{ fontSize: '20px' }} /> : <AiOutlineClose style={{ fontStyle: '20px' }} />}
          </a>
        </div>
      </div>

      <div className={`${style['home-container']}`}>
        <div className={style['left-container']}>
          {user?._id && !user.verifiedEmail && settings.requireEmailVerification
            && (
              <Link href={user.isPerformer ? '/my-account' : '/user/account'}>
                <Alert type="error" style={{ margin: '15px 0', textAlign: 'center' }} message={intl.formatMessage({ id: 'verifyYourEmailUpdate', defaultMessage: 'Please verify your email address, click here to update!' })} />
              </Link>
            )}
          <div className={style['filter-wrapper']}>
            <button
              type="button"
              className={classNames(style['filter-btn'], { [style.active]: type === '' })}
              onClick={() => setType('')}
            >
              {intl.formatMessage({ id: 'allPost', defaultMessage: 'All Post' })}
            </button>
            <button
              type="button"
              className={classNames(style['filter-btn'], { [style.active]: type === 'text' })}
              onClick={() => setType('text')}
            >
              {intl.formatMessage({ id: 'text', defaultMessage: 'Text' })}
            </button>
            <button
              type="button"
              className={classNames(style['filter-btn'], { [style.active]: type === 'photo' })}
              onClick={() => setType('photo')}
            >
              {intl.formatMessage({ id: 'photo', defaultMessage: 'Photo' })}
            </button>
            <button
              type="button"
              className={classNames(style['filter-btn'], { [style.active]: type === 'video' })}
              onClick={() => setType('video')}
            >
              {intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}
            </button>
            <button
              type="button"
              className={classNames(style['filter-btn'], { [style.active]: type === 'audio' })}
              onClick={() => setType('audio')}
            >
              {intl.formatMessage({ id: 'audio', defaultMessage: 'Audio' })}
            </button>
            <button
              type="button"
              className={classNames(style['filter-btn'], { [style.active]: type === 'product' })}
              onClick={() => setType('product')}
            >
              {intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}
            </button>
          </div>
          <ScrollListMedia
            query={{
              q: keyword,
              isHome: true,
              type,
              performerId: activePer
            }}
          />
        </div>
        <div className={style['right-container']} id="home-right-container">
          <div className={style['right-container-content']}>
            <SuggestionPerformerListing />
            <Footer isSideFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedContainer;
