import { Select } from 'antd';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl';
import style from './filter-bar.module.scss';

interface IProps {
  onFilter: (field: string, value: any) => void;
}

export default function FilterBar({ onFilter }: IProps) {
  const intl = useIntl();
  const onSearch = debounce(async (e) => {
    const value = (e.target && e.target.value) || '';
    onFilter('q', value);
  }, 500);

  return (
    <div className={style['filter-bar']}>
      <input
        className={style['filter-search']}
        placeholder={intl.formatMessage({ id: 'enterKeyword', defaultMessage: 'Enter Keyword' })}
        onChange={(e) => {
          e.persist();
          onSearch(e);
        }}
      />
      <Select className={style['filter-type']} defaultValue="" onChange={(val) => onFilter('source', val)}>
        <Select.Option value="">{intl.formatMessage({ id: 'allTypes', defaultMessage: 'All Types' })}</Select.Option>
        <Select.Option value="gallery">{intl.formatMessage({ id: 'gallery', defaultMessage: 'Gallery' })}</Select.Option>
        <Select.Option value="video">{intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}</Select.Option>
        <Select.Option value="feed">{intl.formatMessage({ id: 'feed', defaultMessage: 'Feed' })}</Select.Option>
        <Select.Option value="product">{intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}</Select.Option>
      </Select>
      <Select className={style['filter-time']} defaultValue="" onChange={(val) => onFilter('time', val)}>
        <Select.Option value="">{intl.formatMessage({ id: 'allTime', defaultMessage: 'All Time' })}</Select.Option>
        <Select.Option value="month">{intl.formatMessage({ id: 'thisMonth', defaultMessage: 'This Month' })}</Select.Option>
        <Select.Option value="week">{intl.formatMessage({ id: 'thisWeek', defaultMessage: 'This Week' })}</Select.Option>
      </Select>
    </div>
  );
}
