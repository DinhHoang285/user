/* eslint-disable no-nested-ternary */

'use client';

import { SearchFilter } from '@components/common/search-filter';
import MediaList from '@components/feed/list/table-list';
import EditPPV from '@components/feed/modal/edit-ppv';
import ReasonDelete from '@components/feed/modal/reason-delete';
import { IFeed } from '@interfaces/feed';
import { showError, showSuccess } from '@lib/message';
import { feedService } from '@services/index';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { IUser } from '@interfaces/user';
import { useSession } from 'next-auth/react';

export default function PerformerFeedListing() {
  const [items, setItems] = useState<IFeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1
  });

  const { data: session } = useSession();
  const user: IUser = session?.user as IUser;

  const [filter, setFilter] = useState<any>({
    fromDate: '',
    isFree: '',
    performerId: user._id,
    q: '',
    status: '',
    subscriptionType: '',
    toDate: '',
    type: ''
  });
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const intl = useIntl();
  const [isModalReason, setIsModalReason] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [reason, setReason] = useState('');
  const [contentCurrent, setContentCurrent] = useState<IFeed | null>(null);
  const total = useRef(0);

  const getData = async () => {
    if (!user._id) return;
    try {
      setLoading(true);

      const params = {
        ...filter,
        isTrash: false,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
        performerId: user._id,
        pinProfile: true
      };

      let resp = null;
      resp = await feedService.userSearch(params);
      resp.data.data.length ? setItems(resp.data.data) : setItems([]);
      total.current = resp.data.total;
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy, user]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination, current: pag.current };
    setPagination(pager);
    setSortBy(sorter.field || 'updatedAt');
    setSort(
      sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    );
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const handelDelete = async (item: IFeed) => {
    try {
      if (item.mediaType === 'feed' && item.isFree) {
        if (
          !window.confirm(
            intl.formatMessage({
              id: 'confirmRemovePost',
              defaultMessage:
                'All earnings related to this post will be refunded. Are you sure to remove it?'
            })
          )
        ) {
          return;
        }
        await feedService.delete(item._id);
        showSuccess(
          intl.formatMessage({
            id: 'postDeleteSuccess',
            defaultMessage: 'Post deleted successfully'
          })
        );
      } else if ((item.mediaType === 'short' || item.type === 'reel') && item.isFree) {
        if (
          !window.confirm(
            intl.formatMessage({
              id: 'areYouWantDeleteVideo',
              defaultMessage: 'Are you sure you want to delete this video?'
            })
          )
        ) {
          return;
        }
        await feedService.delete(item._id);
        showSuccess(
          intl.formatMessage({
            id: 'videoDeleteSuccess',
            defaultMessage: 'Video deleted successfully'
          })
        );
      } else {
        setContentCurrent(item);
        setIsModalReason(true);
      }
    } catch (e) {
      showError(e);
    } finally {
      await getData();
    }
  };

  const onEdit = async (data: IFeed) => {
    setContentCurrent(data);
    setIsModalEdit(true);
  };

  const onPin = async (media: IFeed) => {
    const confirmMessage = media.isPinned
      ? intl.formatMessage({
        id: 'confirmUnpinPost',
        defaultMessage: 'Unpin this post from profile?'
      })
      : intl.formatMessage({
        id: 'confirmPinPost',
        defaultMessage: 'Pin this post to profile?'
      });
    if (window.confirm(confirmMessage)) {
      try {
        await feedService.pinPostProfile(media._id);
        const successMessage = media.isPinned
          ? intl.formatMessage({
            id: 'postUnpinnedSuccess',
            defaultMessage: 'Unpinned post successfully'
          })
          : intl.formatMessage({
            id: 'postPinnedSuccess',
            defaultMessage: 'Pinned post successfully'
          });
        showSuccess(successMessage);
        getData();
      } catch (e) {
        showError(e);
      }
    }
  };

  const type = [
    {
      key: '',
      text: intl.formatMessage({ id: 'allPost', defaultMessage: 'All Post' })
    },
    {
      key: 'text',
      text: intl.formatMessage({ id: 'text', defaultMessage: 'Text' })
    },
    {
      key: 'video',
      text: intl.formatMessage({ id: 'video', defaultMessage: 'Video' })
    },
    {
      key: 'photo',
      text: intl.formatMessage({ id: 'photo', defaultMessage: 'Photo' })
    },
    {
      key: 'audio',
      text: intl.formatMessage({ id: 'audio', defaultMessage: 'Audio' })
    },
    {
      key: 'product',
      text: intl.formatMessage({ id: 'products', defaultMessage: 'Products' })
    }
  ];

  return (
    <>
      <SearchFilter
        onSubmit={handleFilter}
        type={type}
        dateRange
        asideButton={(
          <Link href="/my-post/create" className="customs create-feed-btn">
            {intl.formatMessage({ id: 'newPost', defaultMessage: 'New Post' })}
          </Link>
        )}
        changeOrderAside
        setPagination={setPagination}
        typeDefault={filter.mediaType}
      />
      <MediaList
        feeds={items}
        total={total.current}
        pageSize={pagination.pageSize}
        searching={loading}
        onChange={handleTableChange}
        onDelete={handelDelete}
        onEdit={onEdit}
        onPin={onPin}
      />
      {isModalReason && (
        <ReasonDelete
          setIsModalOpen={setIsModalReason}
          isModalOpen={isModalReason}
          setReason={setReason}
          reason={reason}
          content={contentCurrent}
        />
      )}
      {isModalEdit && (
        <EditPPV
          setIsModalOpen={setIsModalEdit}
          isModalOpen={isModalEdit}
          content={contentCurrent}
        />
      )}
    </>
  );
}
