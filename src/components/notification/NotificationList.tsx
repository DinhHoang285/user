'use client';

import { INotification } from '@interfaces/notification';
import { notificationService } from '@services/notification.service';
import {
  Button, List, ListProps
} from 'antd';
import { CSSProperties, useEffect } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import styles from './NotificationHeaderMenu.module.scss';
import NotificationListItem from './NotificationListItem';

interface NotificationListProps extends ListProps<INotification> {
  notificationIds: string[];
  style: CSSProperties;
  notification: any;
  fetchNotification: Function
}

function NotificationList({
  style, notification, fetchNotification, /* notificationIds, */ ...props
}: NotificationListProps) {
  useEffect(() => {
    fetchNotification();
  }, []);
  const intl = useIntl();
  const readAll = async () => {
    await notificationService.readAll();
    fetchNotification();
  };

  return (
    <div className={classNames(styles['notification-wrapper'])}>
      <Button className={classNames(styles['btn-dismiss-all'])} type="primary" onClick={readAll}>
        {intl.formatMessage({ id: 'markAsRead', defaultMessage: 'Mark as read' })}
      </Button>
      <List {...props} style={style} header="All Notifications">
        {/* {notificationIds.length > 0 ? notificationIds.map((id) => <NotificationListItem key={id} id={id} />) : <p>There is no notification.</p>} */}
        <NotificationListItem dataNotification={notification} fetchNotification={fetchNotification} />
      </List>
    </div>
  );
}

export default NotificationList;
