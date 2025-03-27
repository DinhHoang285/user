/* eslint-disable no-nested-ternary */

'use client';

import { AiOutlineUpload } from 'react-icons/ai';
import { SearchFilter } from '@components/common/search-filter';

import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { isMobile } from 'react-device-detect';
import Link from 'next/link';
import { Button, Col, Row } from 'antd';
import { showError } from '@lib/message';
import { advertisementService } from '@services/advertisement.service';
import { TableListAd } from './table-list-ad';

function PerformerAdList() {
  const intl = useIntl();
  const [list, setList] = useState([] as any);
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [limit] = useState(10);
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filter, setFilter] = useState({});

  const search = async () => {
    try {
      setSearching(true);
      const resp = await advertisementService.performerSearch({
        ...filter,
        limit,
        offset: (pagination.current - 1) * limit,
        sort,
        sortBy
      });
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit
      });
    } catch (e) {
      showError(e);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || '');
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '');
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const deleteAdvertisement = async (id: string) => {
    if (
      !window.confirm(
        intl.formatMessage({
          id: 'confirmDeleteAd',
          defaultMessage: 'Are you sure you want to delete this advertisement?'
        })
      )
    ) {
      return;
    }
    try {
      await advertisementService.delete(id);
      search();
    } catch (e) {
      showError(e);
    }
  };

  // Localize statuses array texts
  const statuses = [
    {
      key: '',
      text: intl.formatMessage({ id: 'status', defaultMessage: 'Status' })
    },
    {
      key: 'active',
      text: intl.formatMessage({ id: 'active', defaultMessage: 'Active' })
    },
    {
      key: 'inactive',
      text: intl.formatMessage({ id: 'inactive', defaultMessage: 'Inactive' })
    }
  ];

  return (
    <>
      <div>
        <Row style={{ margin: '0 0 10px 0' }}>
          <Col md={16} xs={24} style={{ padding: '0' }}>
            <SearchFilter
              searchWithKeyword
              statuses={statuses}
              onSubmit={handleFilter}
            />
          </Col>
          <Col
            md={8}
            xs={24}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0'
            }}
          >
            <Button className="primary">
              <Link href="/creator/my-advertisement/upload">
                <span>
                  <AiOutlineUpload />
                  <span>
                    {intl.formatMessage({
                      id: 'uploadNew',
                      defaultMessage: 'Upload new'
                    })}
                  </span>
                </span>
              </Link>
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <TableListAd
          dataSource={list}
          rowKey="_id"
          loading={searching}
          pagination={{
            ...pagination,
            position: ['bottomCenter'],
            showSizeChanger: false,
            simple: isMobile
          }}
          onChange={handleTableChange}
          onDelete={deleteAdvertisement}
        />
      </div>
    </>
  );
}

export default PerformerAdList;
