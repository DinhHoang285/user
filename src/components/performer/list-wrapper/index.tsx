'use client';

import PageHeading from '@components/common/page-heading';
import PerformerGridCard from '@components/performer/card/grid-card';
import { performerService } from '@services/index';
import { Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import withHydrationOnDemand from 'react-hydration-on-demand';
import { ModelIcon } from 'src/icons';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';
import PerformerAdvancedFilter from './advanced-filter';
import PerformerListPagination from './pagination';

const PerformerGridCardVisbile = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  PerformerGridCard
);
const PerformerAdvancedFilterVisbile = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  PerformerAdvancedFilter
);
const PerformerListPaginationVisbile = withHydrationOnDemand({ on: ['idle', 'visible'] })(
  PerformerListPagination
);

export default function PerformersWrapper() {
  const intl = useIntl();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(16);
  const [filter, setFilter] = useState({ sortBy: 'live' });
  const [performers, setPerformers] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(true);

  const getPerformers = async () => {
    try {
      setFetching(true);
      const resp = await performerService.search({
        limit,
        offset: limit * offset,
        ...filter
      });
      setPerformers(resp.data.data);
      setTotal(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const handleFilter = (values) => {
    setOffset(0);
    setFilter({ ...filter, ...values });
  };

  useEffect(() => {
    getPerformers();
  }, [filter, offset, limit]);

  const pageChanged = async (page: number, pageSize: number) => {
    setOffset(page - 1);
    setLimit(pageSize);
  };

  return (
    <div>
      <PageHeading title="Creators" icon={<ModelIcon />} />
      <PerformerAdvancedFilterVisbile onSubmit={handleFilter} />
      <Row>
        {performers && performers.length > 0 && performers.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
            <PerformerGridCardVisbile performer={p} />
          </Col>
        ))}
      </Row>
      {!total && !fetching
      && (
      <p className="text-center" style={{ margin: 20 }}>
        {intl.formatMessage({ id: 'noProfileWasFound', defaultMessage: ' No profile was found' })}
      </p>
      )}
      {fetching && (
        <div className="text-center" style={{ margin: 30 }}>
          <Spin />
        </div>
      )}
      <div className="text-center" style={{ margin: '20px 0' }}>
        {total > 0 && total > limit && (
          <PerformerListPaginationVisbile
            current={offset + 1}
            total={total}
            limit={limit}
            handlePaginationChange={pageChanged}
          />

        )}
      </div>
    </div>
  );
}
