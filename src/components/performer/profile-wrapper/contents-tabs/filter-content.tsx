'use client';

import { DatePicker, Input, Popover } from 'antd';
import {
  AiOutlineAppstore, AiOutlineMenu, AiOutlineSearch, AiOutlineCalendar
} from 'react-icons/ai';
import { replaceRouteState } from '@lib/swr-fetch';
import style from './filter-content.module.scss';

const debounce = require('lodash/debounce');

interface IProps {
  filters: {
    isGrid: string;
    tab: string;
    q: string;
    type: string;
  }
  onFilter: Function;
}

export default function FilterContentWrapper({ filters, onFilter }: IProps) {
  const onSearch = debounce(async (e) => {
    onFilter({
      q: e.target.value
    });
  }, 500);

  const handleViewGrid = (isGrid: boolean) => {
    replaceRouteState({ isGrid });
  };

  const searchDateRange = (dates: [any, any], dateStrings: [string, string]) => {
    if (!dateStrings.length) return;
    onFilter({
      fromDate: dateStrings[0],
      toDate: dateStrings[1]
    });
  };

  const {
    tab, isGrid, q
  } = filters;

  return (
    <div className={style['search-post-bar']}>
      <Popover
        trigger="click"
        content={(
          <Input.Search
            placeholder="Enter keyword here..."
            defaultValue={q || ''}
            onChange={(e) => {
              e.persist();
              onSearch(e);
            }}
            allowClear
            enterButton
          />
        )}
      >
        <button
          type="button"
        >
          <AiOutlineSearch />
        </button>
      </Popover>
      <Popover trigger="click" content={<DatePicker.RangePicker onChange={searchDateRange} />}>
        <button
          type="button"
        >
          <AiOutlineCalendar />
        </button>
      </Popover>
      {(!tab || tab === 'post') && (
        <>
          <button
            type="button"
            className={(!isGrid || isGrid === 'true') ? 'active' : ''}
            onClick={() => handleViewGrid(true)}
          >
            <AiOutlineAppstore />
          </button>
          <button
            type="button"
            className={isGrid !== 'true' ? 'active' : ''}
            onClick={() => handleViewGrid(false)}
          >
            <AiOutlineMenu />
          </button>
        </>
      )}
    </div>
  );
}
