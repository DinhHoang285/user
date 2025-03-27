import { IPerformer } from '@interfaces/index';
import { Popover } from 'antd';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share';
import { ShareIcon } from 'src/icons';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import style from './share-profile.module.scss';

type IProps = {
  performer: IPerformer;
};

function SocialSharePerformer({ performer }: IProps) {
  const intl = useIntl();
  const { settings } = useMainThemeLayout();
  const shareUrl = typeof (window) !== 'undefined' ? `${window?.location?.origin}/${performer?.username || performer?._id}` : '';
  const { theme } = useTheme();

  const shareContent = (
    <div className={style['social-share-btns']}>
      <FacebookShareButton
        url={shareUrl}
        hashtag={`#${performer?.username} #${performer?.name}`}
      >
        <FacebookIcon size={40} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={performer?.bio || ''}
        hashtags={[settings.siteName, performer?.username, performer?.name]}
      >
        {theme === 'dark' ? (
          <Image
            priority
            src="/twitter-icon-white.webp"
            alt="twitter-icon"
            width={40}
            height={40}
          />
        ) : (
          <Image
            priority
            src="/x_icon.png"
            alt="twitter-icon"
            width={40}
            height={40}
          />
        )}
      </TwitterShareButton>
    </div>
  );

  return (
    <Popover
      title={intl.formatMessage({ id: 'shareToSociakNetwork', defaultMessage: 'Share to social network' })}
      content={shareContent}
      trigger="click"
    >
      <button type="button" className={style.btn}>
        <ShareIcon />
        <span className="none">
          {intl.formatMessage({ id: 'share', defaultMessage: 'Share' })}
        </span>
      </button>
    </Popover>
  );
}

export default SocialSharePerformer;
