import { validateMessages } from '@lib/message';
import {
  Col, Form, Input, Row, Select
} from 'antd';
import {
  useEffect,
  useState
} from 'react';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import { IPerformer } from 'src/interfaces';
import { utilsService } from 'src/services';

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating: boolean;
}

export function PerformerBankingForm({
  onFinish,
  user,
  updating
}: IProps) {
  const intl = useIntl();
  const [formRef] = Form.useForm();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const initialValues = { ...user.bankingInformation, ...(user.bankingInformation as any)?.value };

  const handleGetStates = async (countryCode: string) => {
    const resp = await utilsService.statesList(countryCode);
    setStates(resp.data);
    const eState = resp.data.find((s) => s === user?.bankingInformation?.state);
    if (eState) {
      formRef.setFieldsValue({ state: eState });
    } else {
      formRef.setFieldsValue({ state: '', city: '' });
    }
  };

  const handleGetCities = async (state: string, countryCode: string) => {
    const resp = await utilsService.citiesList(countryCode, state);
    if (resp.data) {
      setCities(resp.data);
      const eCity = resp.data.find((s) => s === user?.bankingInformation?.city);
      if (eCity) {
        formRef.setFieldsValue({ city: eCity });
      } else {
        formRef.setFieldsValue({ city: '' });
      }
    }
  };

  useEffect(() => {
    if (user?.bankingInformation?.country) {
      handleGetStates(user?.bankingInformation?.country);
      if (!user?.bankingInformation?.state) {
        handleGetCities(user?.bankingInformation?.state, user?.bankingInformation?.country);
      }
    }
  }, []);

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish.bind(this)}
      validateMessages={validateMessages}
      initialValues={initialValues}
      labelAlign="left"
      className="account-form"
      form={formRef}
    >
      <Row>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'firstName', defaultMessage: 'First name' })}
            name="firstName"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pleaseInputYourFirstName', defaultMessage: 'Please input your first name!' }) }
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'firstName', defaultMessage: 'First name' })} />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="lastName"
            label={intl.formatMessage({ id: 'lastName', defaultMessage: 'Last name' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pleaseInputYourLastName', defaultMessage: 'Please input your last name!' }) }
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'lastName', defaultMessage: 'Last name' })} />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="bankName"
            label={intl.formatMessage({ id: 'bankName', defaultMessage: 'Bank name' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pleaseInputYourBankName', defaultMessage: 'Please input your bank name!' }) }
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'bankName', defaultMessage: 'Bank name' })} />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="bankAccount"
            label={intl.formatMessage({ id: 'bankAccount', defaultMessage: 'Bank Account' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pleaseInputYourBankAccount', defaultMessage: 'Please input your bank account!' }) }
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'bankAccount', defaultMessage: 'Bank Account' })} />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="country"
            label={intl.formatMessage({ id: 'country', defaultMessage: 'Country' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseChooseCountry', defaultMessage: 'Please choose a country!' }) }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              onChange={(val: string) => handleGetStates(val)}
            >
              {COUNTRIES.map((c) => (
                <Option key={c.code} value={c.code} label={c.name}>
                  <p className="select-country">
                    <img
                      alt="country_flag"
                      src={c.flag}
                      width="25px"
                    />
                    <span>
                      {c.name}
                    </span>
                  </p>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="state" label={intl.formatMessage({ id: 'state', defaultMessage: 'State' })}>
            <Select
              placeholder={intl.formatMessage({ id: 'selectYourState', defaultMessage: 'Select your state' })}
              optionFilterProp="label"
              showSearch
              onChange={(val: string) => handleGetCities(val, formRef.getFieldValue('country'))}
            >
              {states.map((state) => (
                <Option value={state} label={state} key={state}>
                  {state}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="city"
            label={intl.formatMessage({ id: 'city', defaultMessage: 'City' })}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'selectYourCity', defaultMessage: 'Select your city' })}
              showSearch
              optionFilterProp="label"
            >
              {cities?.length > 0 ? (
                cities.map((city) => (
                  <Option value={city} label={city} key={city}>
                    {city}
                  </Option>
                ))
              ) : (
                <Option value="" disabled key="no-data">
                  {intl.formatMessage({ id: 'noData', defaultMessage: 'No data' })}
                </Option>
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="address" label={intl.formatMessage({ id: 'address', defaultMessage: 'Address' })}>
            <Input placeholder={intl.formatMessage({ id: 'address', defaultMessage: 'Address' })} />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="bankRouting" label={intl.formatMessage({ id: 'bankRouting', defaultMessage: 'Bank Routing' })}>
            <Input placeholder={intl.formatMessage({ id: 'bankRouting', defaultMessage: 'Bank Routing' })} />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="bankSwiftCode" label={intl.formatMessage({ id: 'bankSwiftCode', defaultMessage: 'Bank swift code' })}>
            <Input placeholder={intl.formatMessage({ id: 'bankSwiftCode', defaultMessage: 'Bank swift code' })} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item className="text-center">
        <button
          className="primary-btn"
          type="submit"
          disabled={updating}
        >
          {intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}
        </button>
      </Form.Item>
    </Form>
  );
}

export default PerformerBankingForm;
