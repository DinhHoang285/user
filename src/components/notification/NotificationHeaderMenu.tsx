/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import {
  Avatar,
  Button,
  Col,
  Row
} from 'antd';
import { AiFillNotification } from 'react-icons/ai';
import Link from 'next/link';
import { INotification } from 'src/interfaces/notification';
import { useContext, useEffect, useState } from 'react';

import { capitalizeFirstLetter } from '@lib/string';
import moment from 'moment';
import { SocketContext } from 'src/socket';
import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { showSuccess } from '@lib/message';
import { notificationService } from '@services/notification.service';
import style from './NotificationHeaderMenu.module.scss';

const SEND_NOTIFICATION = 'send_notification';

function NotificationHeaderMenu() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [fetching, setFetching] = useState(true);

  const router = useRouter();

  const [read, setRead] = useState(false);

  const { socket } = useContext(SocketContext);

  const fetchData = async () => {
    const resp = await notificationService.search({
      limit: 12, sort: 'desc', sortBy: 'updatedAt'
    });
    setNotifications(resp.data.data);
    setFetching(false);
  };

  const onReceiveNotification = (data) => {
    fetchData();
    showSuccess(
      data?.title || data?.message || 'You received a new notification'
    );
  };

  useEffect(() => {
    fetchData();
  }, [read]);

  useEffect(() => {
    if (socket) {
      socket.on(SEND_NOTIFICATION, onReceiveNotification);
    }
    return () => {
      socket && socket.off(SEND_NOTIFICATION, onReceiveNotification);
    };
  }, [socket]);

  const redirect = (notification: INotification) => {
    if (['gift'].includes(notification.type)) {
      return router.push('/messages');
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

      default: return null;
    }
  };

  const onClickItem = (notification) => {
    setRead(true);
    if (!notification.read) {
      notificationService.read(notification._id);
    }
    redirect(notification);
  };

  const markAsRead = async () => {
    await notificationService.readAll();
    fetchData();
  };

  return (
    <div title="Notifications" className={classNames(style['notification-menu'])}>
      <div>
        <span className={style.header}>
          Notifications
          <Button className={classNames(style['btn-dismiss-read-all'])} onClick={markAsRead}>
            Mark as read
          </Button>
          <Link href={pathname === '/notification' ? '#' : '/notification'}>
            <span style={{ marginTop: '6px', marginLeft: '8px' }}>See all</span>
          </Link>
        </span>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              onClick={() => onClickItem(notification)}
              style={{ padding: 0 }}
              key={notification._id}
              className={classNames(style[`${notification.read === false ? 'notification-unread' : 'notification-read'}`])}
            >
              <Row gutter={24} className={classNames(style['notification-item'])}>
                <Col md={3} xs={3}>
                  <Avatar src={notification.thumbnail || '/no-image.jpg'} />
                </Col>
                <Col md={19} xs={19}>
                  <div className={classNames(style['notification-item-list'])}>
                    <div className={classNames(style.message)}>{capitalizeFirstLetter(notification.message)}</div>
                    <span className={classNames(style.time)}><small>{moment(notification.updatedAt).fromNow()}</small></span>
                  </div>
                </Col>
                <Col md={1} xs={1}>
                  <span className={classNames(style[`${notification.read === false ? 'notification-docw' : ''}`])}>
                    <AiFillNotification />
                  </span>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div key="no-notification">There are no notifications.</div>
        )}
      </div>
    </div>
  );
}

export default NotificationHeaderMenu;
