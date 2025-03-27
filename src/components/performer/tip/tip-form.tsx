import { IPerformer } from '@interfaces/index';
import { Avatar, Button, Select } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { AiOutlineCheck } from 'react-icons/ai';
import Image from 'next/image';
import styles from './tip-form.module.scss';

// const GiftSelectors = dynamic(() => import('../gift/gifts-selector'));

interface IProps {
  performer: IPerformer;
  onFinish: Function;
  submiting: boolean;
}

export function TipPerformerForm({
  onFinish,
  submiting = false,
  performer
}: IProps) {
  const intl = useIntl();
  const [price, setPrice] = useState(10);

  const onChangeValue = (val) => {
    setPrice(val);
  };

  return (
    <div className={styles.container}>
      <div className={styles['box-avatar']}>
        <Avatar src={performer?.avatar || '/no-avatar.jpg'} />
      </div>
      <div className={styles['box-content']}>
        <div className={styles.info}>
          <Image
            width={35}
            height={35}
            unoptimized
            className="lock-icon"
            src="/lock-icon.png"
            alt="lock"
          />
          <div className="name">
            <p className="p-name">
              <span>
                {performer?.name || 'N/A'}
                {performer?.verifiedAccount && <AiOutlineCheck style={{ display: 'flex', alignItems: 'center' }} className="primary-color" />}
              </span>
            </p>
            <p className="p-username">
              @
              {performer?.username || 'n/a'}
            </p>
          </div>
        </div>
        <div className={styles.title}>
          {intl.formatMessage({ id: 'tip', defaultMessage: 'TIP' })}
          {' '}
          <span className="username">
            {' '}
            {`@${performer?.username || 'n/a'}`}
            {' '}
          </span>
        </div>
        <div className={styles['box-select']}>
          <Select
            defaultValue="€10"
            style={{ width: 314, height: 41 }}
            onChange={onChangeValue}
            options={[
              { value: 10, label: '€10' },
              { value: 20, label: '€20' },
              { value: 30, label: '€30' },
              { value: 50, label: '€50' },
              { value: 100, label: '€100' },
              { value: 200, label: '€200' },
              { value: 500, label: '€500' },
              { value: 1000, label: '€1000' }
            ]}
          />
        </div>
        <div className={styles['box-submit']}>
          <Button
            className={styles['submit-tip-btn']}
            disabled={submiting || !price}
            loading={submiting}
            onClick={() => onFinish(price)}
          >
            {intl.formatMessage({
              id: 'sendTip',
              defaultMessage: 'SEND TIP'
            })}
          </Button>
        </div>
      </div>
    </div>
  );
}
