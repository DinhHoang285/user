import { AiOutlineCaretRight, AiOutlineCaretLeft } from 'react-icons/ai';
import { getMonth, getYear } from 'date-fns';
import range from 'lodash/range';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import 'swiper/css';
import { Mousewheel, Pagination } from 'swiper/modules';
import styles from './calendar.module.scss';

interface IPropsSelect {
  selected: any;
  onChange: any;
  showTime?: boolean;
  filterDate?: any
  minDay?: string,
  maxDay?: string
}
const years = range(1950, getYear(new Date()) + 1, 1);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default function DatepickerCustom({
  selected, onChange, showTime, filterDate, minDay, maxDay
}: IPropsSelect) {
  const [time, setTime] = useState(new Date());

  SwiperCore.use([Mousewheel, Pagination]);

  const hanleDatePickerChange = (date: Date) => {
    setTime((val) => moment(val).set('date', date.getDate()).set('months', date.getMonth()).set('years', date.getFullYear())
      .toDate());

    setTime((val) => moment(val).set('second', 0).toDate());
  };

  useEffect(() => {
    onChange(time);
  }, [time]);

  return (
    <div className={styles['calendar-datepicker']}>
      <DatePicker
        selected={selected}
        onChange={hanleDatePickerChange}
        inline
        formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 3)}
        shouldCloseOnSelect={false}
        filterDate={filterDate}
        minDate={minDay ? new Date(minDay) : undefined}
        maxDate={maxDay ? new Date(maxDay) : undefined}
        calendarStartDay={1}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          decreaseYear,
          increaseYear,
          changeYear,
          changeMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled
        }) => (
          <>
            <div className="header-row header-row-year">
              <button type="button" onClick={decreaseYear} disabled={prevMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--previous" aria-hidden>
                <AiOutlineCaretLeft />
                {/* <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous" /> */}
              </button>
              <Select
                value={getYear(date)}
                onChange={(e) => changeYear(e)}
              >
                {years.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
              <button type="button" onClick={increaseYear} disabled={nextMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--next" aria-hidden>
                <AiOutlineCaretRight />
              </button>
            </div>
            <div className="header-row">
              <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--previous" aria-hidden>
                <AiOutlineCaretLeft />
              </button>
              <Select
                value={months[getMonth(date)]}
                onChange={(e) => changeMonth(months.indexOf(e))}
              >
                {months.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
              <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--next" aria-hidden>
                <AiOutlineCaretRight />
              </button>
            </div>
          </>

        )}
      />

      {showTime && (
        <div className="data_time">
          <div className="wrap">
            <input
              type="time"
              value={moment(time).format('HH:mm')}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const updatedTime = moment().set('hours', parseInt(hours, 10)).set('minutes', parseInt(minutes, 10)).toDate();
                setTime(updatedTime);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
