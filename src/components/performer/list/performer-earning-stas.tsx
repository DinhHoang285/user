import React from 'react';
import {
  AiOutlineUser, AiOutlineAudio, AiOutlinePicture, AiOutlineComment, AiOutlineDollar, AiOutlineTag, AiOutlineVideoCamera, AiOutlineWallet
} from 'react-icons/ai';
import { IPerformerStatsListing } from '@interfaces/performer';
import { useIntl } from 'react-intl';
import style from './performer-earning-stas.module.scss';

const stasPallete = {
  subcription: {
    icon: <AiOutlineUser />,
    lable: 'subcriptions',
    defaultLable: 'subcriptions'
  },
  video: {
    icon: <AiOutlineAudio />,
    lable: 'videos',
    defaultLable: 'videos'
  },
  gallery: {
    icon: <AiOutlinePicture />,
    lable: 'galleries',
    defaultLable: 'galleries'
  },
  message: {
    icon: <AiOutlineComment />,
    lable: 'message',
    defaultLable: 'message'
  },
  tip: {
    icon: <AiOutlineDollar />,
    lable: 'tips',
    defaultLable: 'tips'
  },
  order: {
    icon: <AiOutlineTag />,
    lable: 'orders',
    defaultLable: 'orders'
  },
  streaming: {
    icon: <AiOutlineVideoCamera />,
    lable: 'streaming',
    defaultLable: 'streaming'
  },
  total: {
    icon: <AiOutlineWallet />,
    lable: 'totalEarning',
    defaultLable: 'Total earning'
  }
};

interface IProps {
  data: IPerformerStatsListing
}
function PerformerEarningStasListing({ data }: IProps) {
  const intl = useIntl();
  if (!data) return null;

  return (
    <div className={style['stas-list']}>
      {Object.keys(data).map((key) => {
        const value = data[key];
        const pallete = stasPallete[key];
        return (
          <div className={style['stas-item']}>
            <div className={style['stas-icon']}>
              {pallete?.icon}
            </div>
            <div className={style['stas-content']}>
              <div className={style['stas-content-total']}>
                €
                {(value?.total || 0).toFixed(2)}
              </div>
              <div className={style['stas-content-lable']}>
                {value.count
                  && <span>{value.count}</span>}
                <span>{pallete && intl.formatMessage({ id: pallete?.lable, defaultMessage: pallete?.defaultLable })}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PerformerEarningStasListing;
