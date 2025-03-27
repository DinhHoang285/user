'use client';

import {
  Input, Modal, Tooltip
} from 'antd';
import { showError } from '@lib/message';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import style from './modal-price.module.scss';

interface IProps {
  setIsModalOpen: Function,
  isModalOpen: boolean,
  setFormData?: Function,
  formData?: any
}

interface NumericInputProps {
  style: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);
function NumericInput(props: NumericInputProps) {
  const intl = useIntl();
  const { value, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  };

  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'));
  };

  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
  ) : (intl.formatMessage({ id: 'inputANumber', defaultMessage: 'Input a number' })
  );

  return (
    <Tooltip
      trigger={['focus']}
      title={title}
      placement="topLeft"
      classNames={{ root: 'numeric-input' }}
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={intl.formatMessage({ id: 'inputANumber', defaultMessage: 'Input a number' })}
        maxLength={3}
        className={style.input}
      />
    </Tooltip>
  );
}

function ModalSetPrice({
  isModalOpen, setIsModalOpen, setFormData, formData
}: IProps) {
  const [value, setValue] = useState('');
  const intl = useIntl();
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        className={style.container}
      >
        <div className={style['box-content']}>
          <p>
            <span>€</span>
            {intl.formatMessage({ id: 'pricePost', defaultMessage: 'Price Post' })}
          </p>
          <hr />
          <NumericInput style={{ width: 120 }} value={value} onChange={setValue} />
          <p className={style.description}>
            <span>
              {intl.formatMessage({ id: 'priceMustBetween', defaultMessage: 'The price must be between €5 - €150' })}
            </span>
          </p>
          <button
            onClick={() => {
              setIsModalOpen(false);
              if (Number(value) >= 5 && Number(value) <= 150) {
                setFormData({
                  ...formData, price: Number(value), isSale: true, isSub: false, isFree: false
                });
              } else {
                showError(intl.formatMessage({ id: 'invalidValue', defaultMessage: 'Invalid value' }));
              }
            }}
            className={style['button-set-price']}
            type="button"
          >
            <span>{intl.formatMessage({ id: 'setPrice', defaultMessage: 'Set price' })}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalSetPrice;
