'use client';

import { AiOutlineFilter } from 'react-icons/ai';
import ImageWithFallback from 'src/components/common/images/image-fallback';
import { IPerformerCategory } from '@interfaces/performer-category';
import {
  Button,
  Form,
  Input,
  Select
} from 'antd';
import classNames from 'classnames';
import { debounce, isNil, omitBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  AGES, BODY_TYPES, BUTTS, COUNTRIES, ETHNICITIES, EYES, GENDERS, HAIRS, HEIGHTS, SEXUAL_ORIENTATIONS, WEIGHTS
} from 'src/constants';
import { performerCategoryService } from '@services/performer-category.service';
import style from './performer-advanced-filter.module.scss';

interface IProps {
  onSubmit: Function;
}

function PerformerAdvancedFilter({
  onSubmit
}: IProps) {
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState<IPerformerCategory[]>([]);
  const intl = useIntl();
  const handleSubmit = debounce((changedVal, allVal) => {
    const submitData = { ...allVal };
    // eslint-disable-next-line no-nested-ternary
    submitData.isFreeSubscription = submitData.isFreeSubscription === 'false' ? false : submitData.isFreeSubscription === 'true' ? true : '';
    onSubmit(omitBy(submitData, isNil));
  }, 600);

  const getData = async () => {
    const [categoriesResp] = await Promise.all([
      performerCategoryService.search()
    ]);
    setCategories(categoriesResp.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Form
      style={{ width: '100%' }}
      onValuesChange={handleSubmit}
      initialValues={{
        isFeatured: '',
        q: '',
        categoryIds: '',
        sortBy: 'live',
        isFreeSubscription: '',
        country: '',
        bodyType: '',
        ethnicity: '',
        weight: '',
        height: '',
        butt: '',
        gender: '',
        sexualOrientation: '',
        age: '',
        hair: '',
        eyes: ''
      }}
    >
      <div className={classNames(style['filter-block'], style.custom)}>
        <Form.Item className={classNames(style['filter-item'], style['item-30'])} name="q">
          <Input
            allowClear
            placeholder={intl.formatMessage({ id: 'enterKeyword', defaultMessage: 'Enter Keyword' })}
          />
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="isFeatured">
          <Select style={{ width: '100%' }}>
            <Select.Option value="">
              {intl.formatMessage({ id: 'allCreators', defaultMessage: 'All creators' })}
            </Select.Option>
            <Select.Option value="true">
              {intl.formatMessage({ id: 'features', defaultMessage: 'Features' })}
            </Select.Option>
            <Select.Option value="false">
              {intl.formatMessage({ id: 'nonFeatured', defaultMessage: 'Non-featured' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-20'])} name="categoryIds">
          <Select style={{ width: '100%' }}>
            <Select.Option value="">
              {intl.formatMessage({ id: 'allCategories', defaultMessage: 'All Categories' })}
            </Select.Option>
            {categories.map((c) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-10'])} name="sortBy">
          <Select style={{ width: '100%' }}>
            <Select.Option value="" disabled>
              <AiOutlineFilter />
              {intl.formatMessage({ id: 'sortBy', defaultMessage: 'Sort By' })}
            </Select.Option>
            <Select.Option value="popular">
              {intl.formatMessage({ id: 'popular', defaultMessage: 'Popular' })}
            </Select.Option>
            <Select.Option label="" value="latest">
              {intl.formatMessage({ id: 'latest', defaultMessage: 'Latest' })}
            </Select.Option>
            <Select.Option value="oldest">
              {intl.formatMessage({ id: 'oldest', defaultMessage: 'Oldest' })}
            </Select.Option>
            <Select.Option value="online">
              {intl.formatMessage({ id: 'online', defaultMessage: 'Online' })}
            </Select.Option>
            <Select.Option value="live">
              {intl.formatMessage({ id: 'live', defaultMessage: 'Live' })}
            </Select.Option>
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
      <div className={classNames(style['filter-block'], style['filter-dropdown'], {
        [style.hide]: !showMore
      })}
      >
        <Form.Item className={style['filter-item']} name="isFreeSubscription">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allSubscription', defaultMessage: 'All subscriptions' })}
            </Select.Option>
            <Select.Option key="false" value="false">
              {intl.formatMessage({ id: 'nonFreeSubscription', defaultMessage: 'Non-free subscription' })}
            </Select.Option>
            <Select.Option key="true" value="true">
              {intl.formatMessage({ id: 'freeSubscription', defaultMessage: 'Free subscription' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="country">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'countries', defaultMessage: 'Countries' })}
            showSearch
            optionFilterProp="label"
          >
            <Select.Option key="All" label="" value="">
              {intl.formatMessage({ id: 'allCoutries', defaultMessage: 'All countries' })}
            </Select.Option>
            {COUNTRIES.map((c) => (
              <Select.Option key={c.code} label={c.name} value={c.code}>
                <ImageWithFallback
                  options={{
                    width: 40,
                    height: 40
                  }}
                  alt="flag"
                  src={c.flag}
                />
                &nbsp;
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="gender">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allGenders', defaultMessage: 'All genders' })}
            </Select.Option>
            {GENDERS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="sexualOrientation">
          <Select
            style={{ width: '100%' }}

          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allSexual', defaultMessage: 'All sexual orientations' })}
            </Select.Option>
            {SEXUAL_ORIENTATIONS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="age">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'age', defaultMessage: 'Age' })}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allAges', defaultMessage: 'All ages' })}
            </Select.Option>
            {AGES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="eyes">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'eyes', defaultMessage: 'Eye color' })}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allEyeColors', defaultMessage: 'All eye colors' })}
            </Select.Option>
            {EYES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="hair">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'hairColor', defaultMessage: 'Hair color' })}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allHairColors', defaultMessage: 'All hair colors' })}
            </Select.Option>
            {HAIRS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="butt">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'buttSize', defaultMessage: 'Butt size' })}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allButtSize', defaultMessage: 'All butt size' })}
            </Select.Option>
            {BUTTS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="height">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'height', defaultMessage: 'Height' })}

          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allHeights', defaultMessage: 'All heights' })}
            </Select.Option>
            {HEIGHTS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="weight">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'weight', defaultMessage: 'Weight' })}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allWeights', defaultMessage: 'All weights' })}
            </Select.Option>
            {WEIGHTS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="ethnicity">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'ethnicity', defaultMessage: 'Ethnicity' })}

          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allEthnicities', defaultMessage: 'All ethnicities' })}
            </Select.Option>
            {ETHNICITIES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="bodyType">
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'bodyType', defaultMessage: 'Body type' })}
          >
            <Select.Option key="all" value="">
              {intl.formatMessage({ id: 'allBodyTypes', defaultMessage: 'All body types' })}
            </Select.Option>
            {BODY_TYPES.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}

export default PerformerAdvancedFilter;
