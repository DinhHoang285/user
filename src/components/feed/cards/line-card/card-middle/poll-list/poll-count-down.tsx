'use client';

import Countdown from 'react-countdown';

export default function PollCountdown({ date }: { date: Date | string }) {
  return <Countdown date={date}><span>Closed</span></Countdown>;
}
