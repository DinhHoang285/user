import { IPerformer } from '@interfaces/performer';
import styles from './social-row.module.scss';

interface IProps {
  performer: IPerformer
}
function SocialRow({ performer }: IProps) {
  const social = performer.socialLinks;
  const socialPattern = [
    {
      key: 'instagram',
      icon: './instagram.webp',
      title: 'Instagram',
      link: social?.instagram
    },
    {
      key: 'x',
      icon: './x.webp',
      title: 'X | Twitter',
      link: social?.twitter
    },
    {
      key: 'tiktok',
      icon: './tiktok.png',
      title: 'Tiktok',
      link: social?.tiktok
    },
    {
      key: 'onlyFans',
      icon: './onlyfans.png',
      title: 'OnlyFans',
      link: social?.onlyFans
    },
    {
      key: 'fansly',
      icon: './fansly.png',
      title: 'Fansly',
      link: social?.fansly
    }
  ];

  return (
    <div className={styles['social-wrapper']}>
      {socialPattern.map((item) => {
        if (!item.link) return null;

        return (
          <a className={styles['social-item']} href={item.link} target="blank">
            <div className={styles['social-item-logo']}>
              <img src={item.icon} alt="" />
            </div>
            <div className={styles['social-item-title']}>
              {item.title}
            </div>
          </a>
        );
      })}
    </div>
  );
}

SocialRow.propTypes = {};

export default SocialRow;
