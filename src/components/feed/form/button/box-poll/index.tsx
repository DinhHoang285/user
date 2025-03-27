/* eslint-disable no-nested-ternary */

'use client';

import { Form, Input } from 'antd';
import { IFeed } from '@interfaces/feed';
import { formatDate } from '@lib/date';
import { PlusIcon, TrashIcon } from 'src/icons';
import AddPollDurationForm from '@components/feed/form/button/box-poll/poll/add-poll-duration';
import moment from 'moment';
import { useIntl } from 'react-intl';
import style from './box-poll.module.scss';

interface IProps {
  addPoll: boolean;
  pollList: any;
  setPollIds: Function;
  feed: IFeed;
  setPollList: Function;
  setOpenPollDuration: any;
  expirePollTime: any;
  setExpiredPollAt: Function;
  setExpirePollTime: Function;
  openPollDuration: boolean;
}

function BoxPoll({
  addPoll,
  pollList,
  setPollIds,
  feed,
  setPollList,
  setOpenPollDuration,
  expirePollTime,
  setExpiredPollAt,
  setExpirePollTime,
  openPollDuration
}: IProps) {
  const intl = useIntl();

  const onChangePoll = async (index, e) => {
    const { value } = e.target;
    setPollList((prev) => {
      const newItems = [...prev];
      newItems[index] = value;
      return newItems;
    });
  };

  const onChangePollDuration = (numberDays) => {
    const date = !numberDays
      ? moment().add(99, 'years')
      : moment().add(numberDays, 'days');

    setOpenPollDuration(false);
    setExpiredPollAt(date);
    setExpirePollTime(numberDays);
  };

  return (
    <div className={style.container}>
      {addPoll && (
        <div>
          <div className={style['poll-form']}>
            <div className={style['poll-top']}>
              {!feed ? (
                <span
                  aria-hidden="true"
                  onClick={() => setOpenPollDuration(true)}
                >
                  <span>
                    {intl.formatMessage({ id: 'pollDuration', defaultMessage: 'Poll duration' })}
                  </span>
                  {' '}
                  <span>
                    {!expirePollTime
                      ? intl.formatMessage({ id: 'noLimit', defaultMessage: 'No limit' })
                      : `${expirePollTime} ${intl.formatMessage({ id: 'days', defaultMessage: 'Days' })}`}
                  </span>
                </span>
              ) : (
                <span>
                  <span>{intl.formatMessage({ id: 'pollExpiration', defaultMessage: 'Poll expiration' })}</span>
                  {' '}
                  <span>{formatDate(feed?.pollExpiredAt)}</span>
                </span>
              )}
            </div>
            <Form.Item
              name="pollDescription"
              className={style['form-item-no-pad']}
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                { required: true, message: intl.formatMessage({ id: 'pleaseAddAQuestion', defaultMessage: 'Please add a question' }) }
              ]}
            >
              <Input placeholder={intl.formatMessage({ id: 'pollPlaceholder', defaultMessage: 'Which console is the best?' })} />
            </Form.Item>
            <div className={style['box-poll']}>
              <Input
                className={style['poll-input']}
                placeholder={intl.formatMessage({ id: 'pollNumber', defaultMessage: 'Poll 1' })}
                value={
                  pollList.length > 0 && pollList[0]._id
                    ? pollList[0].description
                    : pollList[0]
                      ? pollList[0]
                      : ''
                }
                onChange={(e) => onChangePoll(0, e)}
              />
            </div>
            <div className={style['box-poll']}>
              <Input
                disabled={!pollList.length}
                placeholder={intl.formatMessage({ id: 'pollNumber', defaultMessage: 'Poll 2' })}
                className={style['poll-input']}
                value={
                  pollList.length > 1 && pollList[1]._id
                    ? pollList[1].description
                    : pollList[1]
                      ? pollList[1]
                      : ''
                }
                onChange={(e) => onChangePoll(1, e)}
              />
            </div>
            {pollList.map((poll, index) => {
              if (index === 0 || index === 1) return null;
              return (
                <div className={style['box-poll']}>
                  <Input
                    autoFocus
                    placeholder={`Poll ${index + 1}`}
                    key={poll?.description || poll}
                    value={(poll._id ? poll.description : poll) || ''}
                    className={style['poll-input']}
                    onChange={(e) => onChangePoll(index, e)}
                  />
                </div>
              );
            })}
            {pollList.length > 1 && (
              <div className={style['actions-poll-post']}>
                <a
                  style={{ color: '#87878C' }}
                  aria-hidden
                  onClick={() => setPollList(pollList.concat(['']))}
                  className={style['add-option']}
                >
                  <span><PlusIcon /></span>
                  {' '}
                  <span>{intl.formatMessage({ id: 'addOption', defaultMessage: 'Add option' })}</span>
                </a>
                <a
                  style={{ color: '#87878C' }}
                  aria-hidden
                  onClick={() => {
                    setPollList([]);
                    setPollIds([]);
                  }}
                >
                  <span><TrashIcon /></span>
                  {' '}
                  <span>{intl.formatMessage({ id: 'clearPolls', defaultMessage: 'Clear polls' })}</span>
                </a>
              </div>
            )}
          </div>
          <AddPollDurationForm
            onAddPollDuration={onChangePollDuration}
            openDurationPollModal={openPollDuration}
          />
        </div>
      )}
    </div>
  );
}

export default BoxPoll;
