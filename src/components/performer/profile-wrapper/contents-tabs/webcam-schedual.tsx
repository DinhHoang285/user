/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */

'use client';

import { showError } from '@lib/message';
import { scheduleService } from '@services/schedule.service';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { AiFillCalendar, AiFillCaretRight, AiFillEdit } from 'react-icons/ai';
import { IUser } from '@interfaces/user';
import style from './webcam-schedual.module.scss';

const ModalSchedule = dynamic(() => import('./modal-schedule'), { ssr: false });

interface IProps {
  performer: any;
}

export default function WebcamSchedual({ performer }: IProps) {
  const intl = useIntl();
  const { data: session } = useSession();
  const user: IUser = session?.user as any;
  const [showContent, setShowContent] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [dataSchedule, setDataSchedule] = useState([
    { name: 'Monday', text: 'no-broadcasts', url: '' },
    { name: 'Tuesday', text: 'no-broadcasts', url: '' },
    { name: 'Wednesday', text: 'no-broadcasts', url: '' },
    { name: 'Thursday', text: 'no-broadcasts', url: '' },
    { name: 'Friday', text: 'no-broadcasts', url: '' },
    { name: 'Saturday', text: 'no-broadcasts', url: '' },
    { name: 'Sunday', text: 'no-broadcasts', url: '' }
  ]);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const dayName = days[now.getDay()].toLowerCase();

  const handleShowContent = () => {
    setShowContent(!showContent);
  };

  const getData = async () => {
    try {
      const schedule = await scheduleService.searchByPerformer(performer._id);
      if (schedule?.data?.[0]?.schedule) {
        setDataSchedule(schedule.data[0].schedule);
      }
    } catch (error) {
      showError(error);
    }
  };

  const convertTo24Hour = (timeText: string) => {
    const [time, modifier] = timeText.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return [hours, minutes];
  };

  const isCurrentTimeInRange = (timeRange: string) => {
    const [startTimeText, endTimeText] = timeRange.split(' - ');

    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...convertTo24Hour(startTimeText)
    );

    const endTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...convertTo24Hour(endTimeText)
    );

    return now >= startTime && now <= endTime;
  };

  useEffect(() => {
    getData();
  }, [performer._id]);

  return (
    <div>
      <div className={style.container}>
        <div aria-hidden className={`${style.header} ${showContent ? style.deleteBorder : ''}`} onClick={handleShowContent}>
          <div className={style.boxLeft}>
            <i><AiFillCalendar /></i>
            <p>{intl.formatMessage({ id: 'webcamSchedule', defaultMessage: 'Webcam Schedule' })}</p>
          </div>
          <div className={style.boxRight}>
            <i>
              <AiFillCaretRight />
            </i>
          </div>
        </div>
        <div className={`${style['content-wrapper']}`}>
          <div className={`${style.content} ${showContent ? style.show : style.hide}`}>
            {dataSchedule.map((i) => (
              <div key={i.name} className={style['item-content']}>
                <div className={style['content-left']}>
                  {i.name}
                </div>
                <div className={style['content-right']}>
                  {i.text !== 'no-broadcasts' && !!i.text && (!isCurrentTimeInRange(i.text) || dayName !== i.name.toLowerCase())
                    ? (
                      <a
                        href={i.url || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={style.time}
                      >
                        {i.text}
                      </a>
                    )
                    : null}
                  {i.text === 'no-broadcasts' && (
                    <p className={style['no-broadcasts']}>
                      {intl.formatMessage({ id: 'noBroadcasts', defaultMessage: 'No broadcasts' })}
                    </p>
                  )}
                  {i.text && i.text !== 'no-broadcasts' && isCurrentTimeInRange(i.text) && dayName === i.name.toLowerCase()
                    ? (
                      <a
                        href={i.url || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={style['watch-live-stream']}
                      >
                        <span>{intl.formatMessage({ id: 'watchLiveStream', defaultMessage: 'Watch live stream' })}</span>
                      </a>
                    )
                    : null}

                  {user?._id === performer._id && (
                    <i
                      aria-hidden
                      onClick={() => {
                        setCurrentItem(i);
                        setShowModal(true);
                      }}
                    >
                      <AiFillEdit />
                    </i>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <ModalSchedule
          isModalOpen={showModal}
          setIsModalOpen={setShowModal}
          currentItem={currentItem}
          performerId={user._id}
          getData={getData}
        />
      )}
    </div>
  );
}
