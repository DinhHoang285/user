import {
  Button, Col, Modal, Row
} from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

interface IProps {
  onAddPollDuration: Function;
  openDurationPollModal: boolean;
}

export default function AddPollDurationForm({
  onAddPollDuration,
  openDurationPollModal
}: IProps) {
  const intl = useIntl();
  const [limitTime, setLimitTime] = useState(7);

  const onChangePoll = async (value) => {
    setLimitTime(value);
  };

  if (!openDurationPollModal) return null;

  return (
    <Modal
      centered
      title={`${intl.formatMessage({
        id: 'pollDuration',
        defaultMessage: 'Poll Duration'
      })} - ${!limitTime
        ? intl.formatMessage({
          id: 'noLimit',
          defaultMessage: 'No limit'
        })
        : intl.formatMessage({
          id: 'limitDays',
          defaultMessage: '{limitTime} days'
        }, {
          limitTime
        })
      }`}
      open={openDurationPollModal}
      onCancel={() => onAddPollDuration(7)}
      onOk={() => onAddPollDuration(limitTime)}
    >
      <Row>
        <Col span={4.5}>
          <Button
            type={limitTime === 1 ? 'primary' : 'default'}
            onClick={() => onChangePoll(1)}
          >
            1
            {intl.formatMessage({
              id: 'day',
              defaultMessage: 'day'
            })}
          </Button>
        </Col>
        <Col span={4.5}>
          <Button
            type={limitTime === 3 ? 'primary' : 'default'}
            onClick={() => onChangePoll(3)}
          >
            3
            {intl.formatMessage({
              id: 'days',
              defaultMessage: 'days'
            })}
          </Button>
        </Col>
        <Col span={4.5}>
          <Button
            type={limitTime === 7 ? 'primary' : 'default'}
            onClick={() => onChangePoll(7)}
          >
            7
            {intl.formatMessage({
              id: 'days',
              defaultMessage: 'days'
            })}
          </Button>
        </Col>
        <Col span={4.5}>
          <Button
            type={limitTime === 30 ? 'primary' : 'default'}
            onClick={() => onChangePoll(30)}
          >
            30
            {intl.formatMessage({
              id: 'days',
              defaultMessage: 'days'
            })}
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type={limitTime === 0 ? 'primary' : 'default'}
            onClick={() => onChangePoll(0)}
          >
            {intl.formatMessage({
              id: 'noLimit',
              defaultMessage: 'No limit'
            })}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}
