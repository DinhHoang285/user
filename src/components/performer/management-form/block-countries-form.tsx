/* eslint-disable no-template-curly-in-string */
import { validateMessages } from '@lib/message';
import {
  Button, Form, Select
} from 'antd';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import { IBlockCountries } from 'src/interfaces';
import styles from './block-countries-form.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  blockCountries: IBlockCountries;
  updating: boolean;
}

const { Option } = Select;

export function PerformerBlockCountriesForm({
  blockCountries,
  updating,
  onFinish
}: IProps) {
  const intl = useIntl();
  return (
    <Form
      {...layout}
      className={styles['account-form']}
      name="nest-messages"
      onFinish={onFinish.bind(this)}
      validateMessages={validateMessages}
      initialValues={blockCountries}
      labelAlign="left"
    >
      <Form.Item name="countryCodes" label={intl.formatMessage({ id: 'selectCountriesBlock', defaultMessage: 'Select countries you want to block' })}>
        <Select
          showSearch
          optionFilterProp="label"
          mode="multiple"
        >
          {COUNTRIES.map((c) => (
            <Option value={c.code} label={c.name} key={c.code}>
              <img alt="country_flag" src={c.flag} width="25px" />
              {' '}
              {c.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit" className="primary" loading={updating}>
          {intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}
        </Button>
      </Form.Item>
    </Form>
  );
}
