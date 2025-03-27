import { useState, useEffect } from 'react';
import moment from 'moment';

function CountdownTimer({ pollExpiredAt }: any) {
  const calculateTimeLeft = () => {
    const difference = moment(pollExpiredAt).diff(moment());
    return difference > 0 ? moment.utc(difference).format('HH:mm:ss') : '00:00:00';
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [pollExpiredAt]);

  return <span>{timeLeft}</span>;
}

export default CountdownTimer;
