/* eslint-disable no-plusplus */
import moment from 'moment';

export function formatDate(date: Date, format = 'DD/MM/YYYY HH:mm:ss') {
  return moment(date).format(format);
}

export function formatDateFromnow(date: Date) {
  return moment(date).fromNow();
}

export function dobToAge(date: Date) {
  return moment().diff(moment(date), 'years') > 0 && `${moment().diff(moment(date), 'years')}+`;
}

export function nowIsBefore(date: Date) {
  return moment().isBefore(date);
}

export function isExpired(date: Date): boolean | string {
  const now = moment();
  const expiry = moment(date);

  if (!expiry.isValid()) {
    return 'Invalid date';
  }

  const duration = moment.duration(expiry.diff(now));

  if (duration.asMilliseconds() <= 0) {
    return true;
  }

  return false;
}

export function calculateTimeLeft(date: Date) {
  const now = moment();
  const expiry = moment(date);

  if (!expiry.isValid()) {
    return 'Invalid expiry date';
  }

  const duration = moment.duration(expiry.diff(now));

  if (duration.asMilliseconds() <= 0) {
    return 'Expired!';
  }

  const days = Math.floor(duration.asDays());
  const hours = String(duration.hours()).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  return `Time left: ${days} days ${hours}:${minutes}:${seconds}`;
}

export function daysUntil(date) {
  if (!date) {
    return 0;
  }

  const today = moment();
  const targetDate = moment(date, 'YYYY-MM-DD');

  if (!targetDate.isValid()) {
    throw new Error('Ngày truyền vào không hợp lệ');
  }

  // Tính số ngày giữa hai ngày
  return targetDate.diff(today, 'days');
}
export const getDaysInMonth = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayFormatted = date.toLocaleDateString('en-GB', {
      day: '2-digit'
    });
    days.push(dayFormatted);
  }

  return days;
};
