import {
  Button,
  Form,
  Input,
  Select
} from 'antd';
import classNames from 'classnames';
import { debounce, isNil, omitBy } from 'lodash';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import style from './filter-explore.module.scss';

interface IProps {
  onFilter: Function;
}

function FilterExplore({
  onFilter
}: IProps) {
  const [showMore, setShowMore] = useState(false);
  const intl = useIntl();

  const handelValuesChange = debounce((changedVal, allVal) => {
    const submitData = { ...allVal };
    const values = omitBy(submitData, isNil);
    onFilter(values);
  }, 600);

  return (
    <Form
      style={{ width: '100%' }}
      onValuesChange={handelValuesChange}
      initialValues={{
        isFeatured: '',
        source: '',
        isSale: '',
        subscribed: '',
        duration: '',
        uploaded: '',
        sortBy: ''
      }}
    >
      <div className={classNames(style['filter-block'], style.custom)}>
        <Form.Item className={classNames(style['filter-item'], style['item-30'])} name="q">
          <Input
            allowClear
            placeholder={intl.formatMessage({ id: 'enterKeyword', defaultMessage: 'Enter keyword' })}
          />
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="isFeatured">
          <Select style={{ width: '100%' }}>
            <Select.Option value="">
              {intl.formatMessage({ id: 'allContents', defaultMessage: 'All Contents' })}
            </Select.Option>
            <Select.Option value="true">
              {intl.formatMessage({ id: 'featured', defaultMessage: 'Featured' })}
            </Select.Option>
            <Select.Option value="false">
              {intl.formatMessage({ id: 'nonFeatured', defaultMessage: 'Non-featured' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="source">
          <Select style={{ width: '100%' }}>
            <Select.Option value="">
              {intl.formatMessage({ id: 'allCategories', defaultMessage: 'All Categories' })}
            </Select.Option>
            <Select.Option value="video">{intl.formatMessage({ id: 'video', defaultMessage: 'Video' })}</Select.Option>
            <Select.Option value="gallery">{intl.formatMessage({ id: 'galleries', defaultMessage: 'Galleries' })}</Select.Option>
            <Select.Option value="audio">{intl.formatMessage({ id: 'audio', defaultMessage: 'Audio' })}</Select.Option>
            <Select.Option value="product">{intl.formatMessage({ id: 'products', defaultMessage: 'Products' })}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-10'])} name="isSale">
          <Select
            style={{
              minWidth: '100px'
            }}
          >
            <Select.Option value="">{intl.formatMessage({ id: 'allType', defaultMessage: 'All Type' })}</Select.Option>
            <Select.Option value="true">{intl.formatMessage({ id: 'paid', defaultMessage: 'Paid' })}</Select.Option>
            <Select.Option value="false">{intl.formatMessage({ id: 'free', defaultMessage: 'Free' })}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])}>
          <Button
            className={style['filter-item-advance']}
            style={{ width: '100%' }}
            onClick={() => setShowMore(!showMore)}
          >
            {intl.formatMessage({ id: 'advancedSearch', defaultMessage: 'Advanced search' })}
          </Button>
        </Form.Item>
      </div>
      <div className={classNames(style['filter-block'], style.custom, style['filter-dropdown'], {
        [style.hide]: !showMore
      })}
      >
        <Form.Item className={classNames(style['filter-item'], style['item-30'])} name="subscribed">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="" value="">
              {intl.formatMessage({ id: 'allSubscribedType', defaultMessage: 'All Subscribed Type' })}
            </Select.Option>
            <Select.Option key="true" value="true">
              {intl.formatMessage({ id: 'subscribed', defaultMessage: 'Subscribed' })}
            </Select.Option>
            <Select.Option key="false" value="false">
              {intl.formatMessage({ id: 'notSubscribed', defaultMessage: 'Not Subscribed' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-30'])} name="duration">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'duration', defaultMessage: 'Duration' })}
            </Select.Option>
            <Select.Option key="short" value="short">
              {intl.formatMessage({ id: 'shortContent', defaultMessage: 'Short - less then 4 minutes' })}
            </Select.Option>
            <Select.Option key="medium" value="medium">
              {intl.formatMessage({ id: 'mediumContent', defaultMessage: 'Medium - 4-20 minutes' })}
            </Select.Option>
            <Select.Option key="long" value="long">
              {intl.formatMessage({ id: 'longContent', defaultMessage: 'Long 20+ minutes' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="uploaded">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'uploaded', defaultMessage: 'Uploaded' })}
            </Select.Option>
            <Select.Option key="hour" value="hour">
              {intl.formatMessage({ id: 'lastHour', defaultMessage: 'Last Hour' })}
            </Select.Option>
            <Select.Option key="day" value="day">
              {intl.formatMessage({ id: 'today', defaultMessage: 'Today' })}
            </Select.Option>
            <Select.Option key="week" value="week">
              {intl.formatMessage({ id: 'thisWeek', defaultMessage: 'This Week' })}
            </Select.Option>
            <Select.Option key="month" value="month">
              {intl.formatMessage({ id: 'thisMonth', defaultMessage: 'This Month' })}
            </Select.Option>
            <Select.Option key="year" value="year">
              {intl.formatMessage({ id: 'thisYear', defaultMessage: 'This Year' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="sortBy">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'sortBy', defaultMessage: 'Sort by' })}
            </Select.Option>
            <Select.Option key="popular" value="popular">
              {intl.formatMessage({ id: 'mostPopular', defaultMessage: 'Most Popular' })}
            </Select.Option>
            <Select.Option key="view" value="view">
              {intl.formatMessage({ id: 'mostViews', defaultMessage: 'Most Views' })}
            </Select.Option>
            <Select.Option key="like" value="like">
              {intl.formatMessage({ id: 'mostLikes', defaultMessage: 'Most Likes' })}
            </Select.Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}

export default FilterExplore;
