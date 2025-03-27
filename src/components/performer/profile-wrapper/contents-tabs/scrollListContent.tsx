/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { AiOutlineAppstore, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { Button, Input } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ScrollListMedia from '@components/media/list/scroll-list';
import { IPerformer } from '@interfaces/performer';
import styles from './scrollListContent.module.scss';

interface IProps {
  performer: IPerformer
}
function ScrollListContent({ performer }: IProps) {
  const intl = useIntl();
  const [keyword, setKeyword] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [type, setType] = useState('');
  const [isGrid, setIsGrid] = useState(false);
  const onSearchFeed = debounce(async (e) => {
    setKeyword(e);
  }, 600);

  return (
    <div className={styles['scroll-wrapper']}>
      <header className={styles['scroll-header']}>
        <div className={styles['scroll-header-top']}>
          <h3>
            {intl.formatMessage({ id: 'recent', defaultMessage: 'Recent' })}
            {' '}
          </h3>
          <div className={styles['actions-btn-list']}>
            <div className={styles['actions-btn-grid']} onClick={() => setIsGrid(!isGrid)}>
              <span>
                <AiOutlineAppstore style={{
                  color: isGrid ? 'var(--electric-blue)' : ''
                }}
                />
              </span>
            </div>
            <div className={styles['actions-btn-search']}>
              <Input
                className={openSearch ? styles.active : ''}
                prefix={<AiOutlineSearch />}
                placeholder={intl.formatMessage({ id: 'typeToSearchHere', defaultMessage: 'Type to search here ...' })}
                onChange={(e) => {
                  e.persist();
                  onSearchFeed(e.target.value);
                }}
              />
              <a aria-hidden className={styles['open-search']} onClick={() => setOpenSearch(!openSearch)}>
                <span>
                  {!openSearch ? <AiOutlineSearch /> : <AiOutlineClose />}
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className={styles['scroll-header-bottom']}>
          <Button
            className={classNames({ active: type === '' })}
            onClick={() => setType('')}
          >
            {intl.formatMessage({ id: 'allpost', defaultMessage: 'All Post' })}
          </Button>
          <Button
            className={classNames({ active: type === 'text' })}
            onClick={() => setType('text')}
          >
            {intl.formatMessage({ id: 'text', defaultMessage: 'Text' })}
          </Button>
          <Button
            className={classNames({ active: type === 'photo' })}
            onClick={() => setType('photo')}
          >
            {intl.formatMessage({ id: 'photo', defaultMessage: 'Photo' })}
          </Button>
          <Button
            className={classNames({ active: type === 'video' })}
            onClick={() => setType('video')}
          >
            {intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}
          </Button>
          <Button
            className={classNames({ active: type === 'audio' })}
            onClick={() => setType('audio')}
          >
            {intl.formatMessage({ id: 'audio', defaultMessage: 'Audio' })}
          </Button>
          <Button
            className={classNames({ active: type === 'product' })}
            onClick={() => setType('product')}
          >
            {intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}
          </Button>
        </div>
      </header>
      <main className={styles['scroll-content']}>
        <ScrollListMedia
          isGrid={isGrid}
          query={{
            q: keyword,
            isHome: true,
            type,
            performerId: performer._id,
            isTrash: false,
            pinProfile: true
          }}
        />
      </main>
    </div>
  );
}

export default ScrollListContent;
