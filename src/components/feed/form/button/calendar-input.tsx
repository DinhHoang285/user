'use client';

import { formatDate } from '@lib/date';
import { Button, Modal } from 'antd';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { IconDatePicker } from 'src/icons';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
import styles from './calendar-input.module.scss';

const DatepickerCustom = dynamic(() => import('./datepicker'), { ssr: false });
interface IPropsSelect {
  title?: string;
  titlePopup: string;
  defaultValue?: any;
  showTime?: boolean;
  buttonclick?: any;
  onSubmit?: Function;
  filterDate?: any;
  minDay?: string;
  maxDay?: string;
}

export default function InputCalendar({
  title,
  titlePopup,
  defaultValue,
  showTime,
  buttonclick,
  onSubmit = () => { },
  filterDate,
  minDay,
  maxDay
}: IPropsSelect) {
  const [focused, setFocus] = useState(!!defaultValue);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [startDate, setStartDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<any>(null);
  const intl = useIntl();

  const formattedDate = formatDate(
    startDate,
    showTime ? 'D MMM YYYY hh:mm' : 'DD/MM/YYYY'
  );
  const hours = startDate?.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const showResult = showTime ? `${formattedDate} ${ampm}` : `${formattedDate}`;

  const handleChange = (e) => {
    setStartDate(e);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  const handleSubmit = () => {
    if (!buttonclick) {
      setInputValue(showResult);
      setFocus(true);
    }
    setIsOpen(false);
    onSubmit(startDate);
  };

  const handleBlur = () => {
    if (
      inputRef.current.value?.length === 0
      || inputRef.current.value === undefined
    ) {
      setFocus(false);
    } else {
      setFocus(true);
    }
  };

  return (
    <>
      {!buttonclick ? (
        <div
          className={classNames(
            styles['calendar-input'],
            { [styles.focused]: focused },
            'calendar-input'
          )}
        >
          <div className={styles['title-input']}>{title}</div>
          <input
            type="text"
            onFocus={() => setFocus(true)}
            onBlur={handleBlur}
            onChange={handleBlur}
            ref={inputRef}
            onClick={handleClick}
            value={inputValue}
          />
          <button
            type="button"
            className="example-custom-input"
            onClick={handleClick}
            aria-hidden
          >
            <IconDatePicker />
          </button>
        </div>
      ) : (
        <div onClick={handleClick} aria-hidden>
          {buttonclick}
        </div>
      )}
      <Modal
        centered
        title={titlePopup}
        open={isOpen}
        footer={null}
        width={350}
        className={`${styles['calendar-popup']} ${styles.showtime}`}
        onCancel={() => setIsOpen(!isOpen)}
      >
        <DatepickerCustom
          filterDate={filterDate}
          showTime={showTime}
          selected={startDate}
          onChange={handleChange}
          minDay={minDay}
          maxDay={maxDay}
        />
        <div className="bottom">
          <Button
            type="primary"
            className="btn-submit"
            htmlType="submit"
            onClick={handleSubmit}
          >
            {intl.formatMessage({ id: 'save', defaultMessage: 'Save' })}
          </Button>
        </div>
      </Modal>
    </>
  );
}
