'use client';

import { showError } from '@lib/message';
import { notificationService } from '@services/notification.service';
import { Skeleton } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationList from './NotificationList';

interface NotificationProps {
  style?: CSSProperties
}

function Notification(notificationProps: NotificationProps) {
  const { style } = notificationProps;
  const [loading, setLoading] = useState(false);
  const notification = {
    notificationIds: [],
    notificationMapping: [],
    total: 0,
    page: 1,
    dataSource: [],
    success: false,
    error: null,
    loading: false
  };

  const fetchNotification = async () => {
    try {
      notification.loading = true;
      const resp = await notificationService.search({
        limit: 12, sort: 'desc', sortBy: 'updatedAt'
      });
      if (resp.data && resp.data.data && resp.data.data.length) {
        const ids = resp.data.data.map((data) => data._id);
        notification.notificationIds = ids;
        const mapping = resp.data.data.reduce(
          (previousValue, currentValue) => ({
            ...previousValue,
            [currentValue._id]: currentValue
          }),
          {}
        );

        notification.dataSource = resp.data.data;
        notification.notificationMapping = Object.assign(notification.notificationMapping, mapping);
      }

      const unread = await notificationService.countUnread();
      notification.page += 1;
      notification.total = unread.data;
      notification.success = true;
    } catch (e) {
      const error = await Promise.resolve(e);
      showError(error);
      notification.error = error;
    } finally {
      setLoading(false);
    }
  };

  const canLoadMore = !loading && notification.notificationIds.length < notification.total;

  const addNotificaion = async () => {
    try {
      setLoading(true);
      const resp = await notificationService.search({
        limit: 12, offset: (notification.page - 1) * 1, sort: 'desc', sortBy: 'updatedAt'
      });
      if (resp.data) {
        const ids = resp.data.data.map((item) => item._id);
        const mapping = resp.data.data.reduce(
          (previousValue, currentValue) => ({
            ...previousValue,
            [currentValue._id]: currentValue
          }),
          {}
        );
        notification.notificationMapping = Object.assign(notification.notificationMapping, mapping);
        notification.notificationIds = ids;
        notification.dataSource = [...notification.dataSource, ...resp.data.data];
        const unread = await notificationService.countUnread();
        notification.total = unread.data;
        notification.success = true;
      }
    } catch (e) {
      const fetchError = await Promise.resolve(e);
      showError(fetchError);
      notification.error = fetchError;
    } finally {
      setLoading(false);
    }
  };
  const loadMore = () => {
    addNotificaion();
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <InfiniteScroll
      hasMore={canLoadMore}
      next={loadMore}
      dataLength={notification.notificationIds.length}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
    >
      <NotificationList
        style={style}
        notificationIds={notification.notificationIds}
        fetchNotification={fetchNotification}
        notification={notification}
      />
    </InfiniteScroll>
  );
}

Notification.displayName = 'Notification';
Notification.defaultProps = {
  style: {}
};

export default Notification;
