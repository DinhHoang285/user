import { showError } from '@lib/message';
import { scheduleService } from '@services/schedule.service';
import {
  Button, Input,
  Modal
} from 'antd';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import style from './modal-schedule.module.scss';

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: Function;
  currentItem: any;
  performerId: string;
  getData: Function;
}
function ModalSchedule({
  isModalOpen, setIsModalOpen, currentItem, performerId, getData
}: IProps) {
  const convert12HourTo24Hour = (time12Hour) => dayjs(time12Hour, 'hh:mm A').format('HH:mm');
  const [timeStart, setTimeStart] = useState(convert12HourTo24Hour(currentItem.timeStart) || dayjs().format('HH:mm') || '');
  const [timeEnd, setTimeEnd] = useState(convert12HourTo24Hour(currentItem.timeEnd) || dayjs().format('HH:mm') || '');
  const [urlStream, setUrlStream] = useState(currentItem.url || '');
  const intl = useIntl();
  const handleDelete = async () => {
    try {
      const payload = {
        timeStart: '',
        timeEnd: '',
        text: 'no-broadcasts',
        day: currentItem.name,
        url: '',
        isDelete: true
      };
      await scheduleService.editSchedule(payload, performerId);
      setIsModalOpen(false);
      getData();
    } catch (error) {
      // console.log('Error ===>', error);
    }
  };

  const formatTimeTo12Hour = (time24Hour) => dayjs(time24Hour, 'HH:mm').format('hh:mm A');
  const isValidTime = (time) => {
    const timeRegex = /^(\d{1,2}):(\d{2})(\s?(AM|PM))?$/i;
    return timeRegex.test(time);
  };

  const handleSubmit = async () => {
    if (!urlStream.trim().length) {
      showError(intl.formatMessage({ id: 'pleaseAddTheUrlToYourLivestream,ThatWillHelpUseesFindYourLivestream.', defaultMessage: 'Please add the url to your livestream, that will help users find your livestream.' }));
      return;
    }
    if (!isValidTime(timeStart) || !isValidTime(timeEnd)) {
      showError(intl.formatMessage({ id: 'invalidTimeFormat.PleaseEnterAValidStartAndEndTime.', defaultMessage: 'Invalid time format. Please enter a valid start and end time.' }));
      return;
    }

    const payload = {
      timeStart: formatTimeTo12Hour(timeStart),
      timeEnd: formatTimeTo12Hour(timeEnd),
      day: currentItem.name,
      url: urlStream
    };

    try {
      await scheduleService.editSchedule(payload, performerId);
      setIsModalOpen(false);
      getData();
    } catch (error) {
      showError('Error ===>');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <Modal
      title={currentItem.name || ''}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={false}
      className={style.modal}
    >
      <div className={style.container}>
        <div className={style.boxTime}>
          <div className={style.boxStart}>
            <h2>{intl.formatMessage({ id: 'start', defaultMessage: 'Start' })}</h2>
            <div className={style.boxInput}>
              <input
                type="time"
                id="timeInputStart"
                name="timeStart"
                value={timeStart || ''}
                onChange={(e) => {
                  setTimeStart(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className={style.boxEnd}>
            <h2>{intl.formatMessage({ id: 'end', defaultMessage: 'End' })}</h2>
            <div className={style.boxInput}>
              <input
                type="time"
                id="timeInputEnd"
                name="timeEnd"
                value={timeEnd || ''}
                onChange={(e) => setTimeEnd(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className={style.boxUrl}>
          <p>{intl.formatMessage({ id: 'liveStreamProfile', defaultMessage: 'Live Stream Profile' })}</p>
          <Input value={urlStream} type="text" onChange={(e) => setUrlStream(e.target.value)} />
        </div>
        <div className={style.boxButton}>
          <Button
            className={style.erase}
            type="default"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {intl.formatMessage({ id: 'eraseSchedual', defaultMessage: 'Erase Schedual' })}
          </Button>
          <Button
            className={style.scheduale}
            type="default"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {intl.formatMessage({ id: 'schedual', defaultMessage: 'Schedual' })}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalSchedule;
