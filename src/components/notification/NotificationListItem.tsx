/* eslint-disable no-param-reassign */
/* eslint-disable indent */
import { showSuccess } from '@lib/message';
import { capitalizeFirstLetter } from '@lib/string';
import { notificationService } from '@services/notification.service';
import {
  Avatar,
  Col,
  Menu,
  Row
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { INotification } from 'src/interfaces';
import { SocketContext } from 'src/socket';
import { AiFillNotification } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import style from './NotificationHeaderMenu.module.scss';

const SEND_NOTIFICATION = 'send_notification';

interface IProps {
  dataNotification: any;
  fetchNotification: Function;
}

function NotificationListItem({ dataNotification, fetchNotification }: IProps) {
  const intl = useIntl();
  const { socket } = useContext(SocketContext);
  const [read, setRead] = useState(false);
  const router = useRouter();

  const notifications = dataNotification.dataSource;

  const fetchData = () => {
    fetchNotification();
  };

  const onReceiveNotification = (data) => {
    fetchData();
    showSuccess(
      data?.title
      || data?.message
      || intl.formatMessage({
        id: 'newNotification',
        defaultMessage: 'You received a new notification'
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, [read]);

  useEffect(() => {
    if (socket) {
      (socket as any)?.on(SEND_NOTIFICATION, onReceiveNotification);
    }
    return () => {
      (socket as any)?.off(SEND_NOTIFICATION, onReceiveNotification);
    };
  }, [socket]);

  const redirect = (notification: INotification) => {
    if (['gift'].includes(notification.type)) {
      return router.push('/');
    }
    if (['purchase', 'tip'].includes(notification.type)) {
      return router.push('/my-earning');
    }
    if (['subscribe'].includes(notification.type)) {
      return router.push('/my-subscriber');
    }
    switch (notification.refSource) {
      case 'performer':
        return router.push(`/${notification.refId}`);
      case 'feed':
        return router.push(`/post/${notification.refId}`);
      case 'video':
        return router.push(`/video/${notification.refId}`);
      case 'product':
        return router.push(`/product/${notification.refId}`);
      case 'gallery':
        return router.push(`/gallery/${notification.refId}`);
      default:
        return null;
    }
  };

  const onClickItem = (notification) => {
    setRead(true);
    if (!notification?.read) {
      notificationService.read(notification._id);
      dataNotification.total = dataNotification.total ? dataNotification.total - 1 : 0;
    }
    redirect(notification);
  };

  const menuItems = notifications.length > 0
    ? notifications.map((notification) => ({
      key: notification._id,
      label: (
        <Row
          gutter={24}
          className="notification-item"
          onClick={() => onClickItem(notification)}
        >
          <Col md={3} xs={3} className="avatar">
            <Avatar src={notification.thumbnail || '/no-image.jpg'} />
          </Col>
          <Col md={20} xs={19}>
            <div className={classNames(style['notification-item-list'])}>
              <p className={classNames(style.message)}>
                {capitalizeFirstLetter(notification.message)}
              </p>
              <span className={classNames(style.time)}>
                <small>{moment(notification.updatedAt).fromNow()}</small>
              </span>
            </div>
          </Col>
          <Col md={1} xs={1}>
            <span className={classNames(style.$)}>
              <AiFillNotification />
            </span>
          </Col>
        </Row>
      ),
      className: classNames(
        style[notification?.read === false ? 'notification-unread' : 'notification-read']
      )
    }))
    : [
      {
        key: 'no-notifications',
        label: intl.formatMessage({
          id: 'noNotifications',
          defaultMessage: 'There are no notifications.'
        })
      }
    ];

  return (
    <Menu
      title={intl.formatMessage({
        id: 'notifications',
        defaultMessage: 'Notifications'
      })}
      className={classNames(style['notification-page'])}
      items={menuItems}
    />
  );
}

NotificationListItem.displayName = 'NotificationListItem';

export default NotificationListItem;
