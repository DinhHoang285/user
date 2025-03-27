import { IPerformer } from 'src/interfaces';
import { COUNTRIES } from 'src/constants/countries';
import Image from 'next/image';
// import { convertDateToZodiac } from '@lib/string';
import moment from 'moment';
import style from './style.module.scss';

type IProps = {
  performer: IPerformer;
}

export default function AboutPerformer({
  performer
}: IProps) {
  const country = performer?.country && COUNTRIES.find((c) => c.code === performer.country);

  const replaceURLs = (str: string) => {
    if (!str) return 'No bio yet';

    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    const result = str.replace(urlRegex, (url: string) => {
      let hyperlink = url;
      if (!hyperlink.match('^https?:\\/\\/')) {
        hyperlink = `http://${hyperlink}`;
      }
      return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    return result;
  };

  const renderCountry = () => {
    if (!country) return 'BIOGRAPHY';

    return (
      <>
        {country && (
          <Image
            width={50}
            height={50}
            sizes="10vw"
            style={{ height: 20, width: 'auto' }}
            alt="flag"
            src={country.flag}
          />
        )}
        &nbsp;
        {country.name}
      </>
    );
  };

  return (
    <details className={style['about-block']} open>
      <summary>
        {renderCountry()}
      </summary>
      <div
        className={style.bio}
            // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: replaceURLs(performer.bio || 'No bio yet...') }}
      />
      <div className={style['p-atributes']}>
        {performer.gender && (
        <div className="atr-item">
          <span className="a-label">
            Gender:
          </span>
          {performer.gender}
        </div>
        )}
        {performer.sexualOrientation && (
        <div className="atr-item">
          <span className="a-label">
            Sexual orientation:
          </span>
          {performer.sexualOrientation}
        </div>
        )}
        {performer.dateOfBirth && (
        <div className="atr-item">
          <span className="a-label">
            Zodiac:
          </span>
          {/* {convertDateToZodiac(performer.dateOfBirth)} */}
          {moment(performer.dateOfBirth).format()}
        </div>
        )}
        {performer.city && (
        <div className="atr-item">
          <span className="a-label">
            City:
          </span>
          {performer.city}
        </div>
        )}
        {performer.state && (
        <div className="atr-item">
          <span className="a-label">
            State:
          </span>
          {performer.state}
        </div>
        )}
        {performer.bodyType && (
        <div className="atr-item">
          <span className="a-label">
            Body:
          </span>
          {performer.bodyType}
        </div>
        )}
        {performer.height && (
        <div className="atr-item">
          <span className="a-label">
            Height:
          </span>
          {performer.height}
        </div>
        )}
        {performer.weight && (
        <div className="atr-item">
          <span className="a-label">
            Weight:
          </span>
          {performer.weight}
        </div>
        )}
        {performer.eyes && (
        <div className={style['performer-info']}>
          <div className="atr-item">
            <span className="a-label">
              Eye color:
            </span>
            {performer.eyes}
          </div>
        </div>
        )}
        {performer.ethnicity && (
        <div className="atr-item">
          <span className="a-label">
            Ethnicity:
          </span>
          {performer.ethnicity}
        </div>
        )}
        {performer.hair && (
        <div className="atr-item">
          <span className="a-label">
            Hair color:
          </span>
          {performer.hair}
        </div>
        )}
        {performer.butt && (
        <div className="atr-item">
          <span className="a-label">
            Butt:
          </span>
          {performer.butt}
        </div>
        )}
      </div>
    </details>
  );
}
