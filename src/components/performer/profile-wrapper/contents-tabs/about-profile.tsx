/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { formatDate } from '@lib/date';
import { Collapse, Descriptions } from 'antd';
import {
  AiFillRightCircle, AiOutlineStar, AiOutlineCheck
} from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { IPerformer } from 'src/interfaces';
import styles from './about-profile.module.scss';

type IProps = {
  performer: IPerformer;
  defaultActiveKey?: any;
};

export function AboutPerformer({ performer, defaultActiveKey }: IProps) {
  if (!performer) return null;
  const intl = useIntl();

  const replaceURLs = (str: string) => {
    if (!str) {
      return intl.formatMessage({
        id: 'noBioYet',
        defaultMessage: 'No Bio Yet!'
      });
    }

    const urlRegex = /(?<!<a[^>]*?>)(https?:\/\/[^\s<]+|www\.[^\s<]+)(?![^<]*?<\/a>)/g;

    const result = str.replace(urlRegex, (url: string) => {
      let hyperlink = url;
      if (!hyperlink.match('^https?:\\/\\/')) {
        hyperlink = `http://${hyperlink}`;
      }
      return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    return result;
  };

  return (
    <div className={styles['about-wrapper']}>
      <header className={styles['about-header']}>
        <div className={styles['about-header-name']}>
          {performer.name || 'N/A'}
        </div>
        <div className={styles['about-header-username']}>
          {`@${performer.username || 'n/a'}`}
          &nbsp;
          {performer.verifiedAccount && <AiOutlineCheck />}
          &nbsp;
          {performer.isFeatured && <AiOutlineStar />}
        </div>
      </header>
      <main className={styles['about-main']}>
        <div className={styles['about-main-stas']}>
          <p>
            {performer.stats.followers}
            <span>
              {performer.stats.followers >= 2 ? intl.formatMessage({ id: 'followers', defaultMessage: 'Followers' }) : intl.formatMessage({ id: 'follower', defaultMessage: 'Follower' })}
            </span>
          </p>
          <p>
            {performer.stats.subscribers}
            <span>
              {performer.stats.subscribers >= 2 ? intl.formatMessage({ id: 'subscribers', defaultMessage: 'Subscribers' }) : intl.formatMessage({ id: 'subscriber', defaultMessage: 'Subscriber' })}
            </span>
          </p>
        </div>
        <div
          className={styles['about-main-bio']}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: replaceURLs(
              performer?.bio
              || intl.formatMessage({
                id: 'noBioYet',
                defaultMessage: 'No Bio Yet!'
              })
            )
          }}
        />
        <Collapse
          className={styles['about-main-more']}
          defaultActiveKey={defaultActiveKey}
          bordered={false}
          accordion
          items={[{
            key: '1',
            showArrow: false,
            label: (
              <div className={styles['about-main-more-header']}>
                <p>
                  {intl.formatMessage({ id: 'readMore', defaultMessage: 'Read more' })}
                </p>
                <AiFillRightCircle />
              </div>
            ),
            children: (
              <Descriptions className={styles['about-main-info']}>
                {performer?.gender && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'gender', defaultMessage: 'Gender' })}>
                    {performer?.gender}
                  </Descriptions.Item>
                )}
                {performer?.sexualOrientation && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'sexualOrientation', defaultMessage: 'Sexual orientation' })}>
                    {performer?.sexualOrientation}
                  </Descriptions.Item>
                )}
                {performer?.dateOfBirth && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'dateOfBirth', defaultMessage: 'Date of birth' })}>
                    {formatDate(performer?.dateOfBirth, 'DD/MM/YYYY')}
                  </Descriptions.Item>
                )}
                {performer?.bodyType && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'bodyType', defaultMessage: 'Body Type' })}>
                    {performer?.bodyType}
                  </Descriptions.Item>
                )}
                {performer?.state && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'state', defaultMessage: 'State' })}>
                    {performer?.state}
                  </Descriptions.Item>
                )}
                {performer?.city && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'city', defaultMessage: 'City' })}>
                    {performer?.city}
                  </Descriptions.Item>
                )}
                {performer?.height && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'height', defaultMessage: 'Height' })}>
                    {performer?.height}
                  </Descriptions.Item>
                )}
                {performer?.weight && (
                  <Descriptions.Item label={intl.formatMessage({ id: 'weight', defaultMessage: 'Weight' })}>
                    {performer?.weight}
                  </Descriptions.Item>
                )}
                {performer?.metaData && Object.entries(performer.metaData).map(([key, value]) => (
                  value && key !== 'onlineAt' && key !== 'offlineAt' && (
                    <Descriptions.Item
                      key={key}
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    >
                      {typeof value === 'string' || typeof value === 'number' ? value : String(value)}
                    </Descriptions.Item>
                  )
                ))}
              </Descriptions>
            )
          }]}
        />

      </main>
    </div>
  );
}

AboutPerformer.defaultProps = {
  defaultActiveKey: null
};

export default AboutPerformer;
