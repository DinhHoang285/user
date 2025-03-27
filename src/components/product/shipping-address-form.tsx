import { AiOutlineDelete } from 'react-icons/ai';
import { IAddress } from '@interfaces/index';
import { showError } from '@lib/message';
import { shippingAddressService } from '@services/shipping-address.service';
import {
  Button,
  Col,
  Divider,
  Form, Input,
  List,
  Row, Select
} from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import style from './shipping-address-form.module.scss';

const citystatejson = require('countrycitystatejson');

interface IProps {
  submiting: boolean;
  onFinish: Function;
  onCancel: Function;
  addresses: IAddress[];
  onRemoveAddress: Function;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function ShippingAddressForm({
  submiting, onFinish, onCancel, addresses, onRemoveAddress
}: IProps) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formRef] = Form.useForm();
  const intl = useIntl();

  const handleGetStates = async (countryCode: string) => {
    if (!countryCode) return;
    const data = await citystatejson.getStatesByShort(countryCode);
    setStates(data);
  };

  const handleGetCities = async (state: string, countryCode: string) => {
    if (!state || !countryCode) return;
    const data = await citystatejson.getCities(countryCode, state);
    setCities(data);
  };

  const deleteAddress = async (id) => {
    try {
      await shippingAddressService.delete(id);
      onRemoveAddress(id);
    } catch (e) {
      showError(e);
    }
  };

  return (
    <div className={(style['my-shipping-container'])}>
      <Form
        form={formRef}
        {...layout}
        onFinish={(data) => onFinish(data)}
        name="form-address"
        className="account-form"
      >
        <Row>
          <Col md={24} xs={24}>
            <Form.Item
              name="name"
              label={intl.formatMessage({
                id: 'addressName',
                defaultMessage: 'Address Name'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseEnterAddressName',
                    defaultMessage: 'Please enter address name'
                  })
                }
              ]}
            >
              <Input placeholder={intl.formatMessage({
                id: 'schoolHomeWork',
                defaultMessage: 'School, home, work,...'
              })}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="country"
              label={intl.formatMessage({
                id: 'country',
                defaultMessage: 'Country'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseChooseCountry',
                    defaultMessage: 'Please choose your country'
                  })
                }
              ]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                onChange={(code: string) => handleGetStates(code)}
              >
                {COUNTRIES.map((c) => (
                  <Select.Option value={c.code} label={c.name} key={c.code}>
                    <img alt="country_flag" src={c.flag} width="25px" />
                    {' '}
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="state"
              label={intl.formatMessage({
                id: 'state',
                defaultMessage: 'State'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'selectYourState',
                    defaultMessage: 'Select your state'
                  })
                }
              ]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                onChange={(s: string) => handleGetCities(s, formRef.getFieldValue('country'))}
                placeholder={intl.formatMessage({
                  id: 'stateCountyProvince',
                  defaultMessage: 'State/county/province'
                })}
              >
                <Select.Option value="n/a" key="N/A">
                  N/A
                </Select.Option>
                {states.map((s) => (
                  <Select.Option value={s} label={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="city"
              label={intl.formatMessage({
                id: 'city',
                defaultMessage: 'City'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'selectYourCity',
                    defaultMessage: 'Please select your city'
                  })
                }
              ]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder={intl.formatMessage({
                  id: 'city',
                  defaultMessage: 'City'
                })}
              >
                <Select.Option value="n/a" key="N/A">
                  N/A
                </Select.Option>
                {cities.map((c) => (
                  <Select.Option value={c} label={c} key={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="district"
              label={intl.formatMessage({
                id: 'district',
                defaultMessage: 'District'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseEnterDistrict',
                    defaultMessage: 'Please enter your district'
                  })
                }
              ]}
            >
              <Input placeholder={intl.formatMessage({
                id: 'district',
                defaultMessage: 'District'
              })}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="ward"
              label={intl.formatMessage({
                id: 'ward',
                defaultMessage: 'Ward'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseEnterWard',
                    defaultMessage: 'Please enter your ward'
                  })
                }
              ]}
            >
              <Input placeholder={intl.formatMessage({
                id: 'ward',
                defaultMessage: 'Ward'
              })}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="streetAddress"
              label={intl.formatMessage({
                id: 'streetAddress',
                defaultMessage: 'Street Address'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseEnterStreetAddress',
                    defaultMessage: 'Please enter your street address'
                  })
                }
              ]}
            >
              <Input placeholder={intl.formatMessage({
                id: 'streetAddress',
                defaultMessage: 'Street Address'
              })}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="streetNumber"
              label={intl.formatMessage({
                id: 'streetNumber',
                defaultMessage: 'Street Number'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseEnterStreamNumber',
                    defaultMessage: 'Please enter your street number'
                  })
                }
              ]}
            >
              <Input placeholder={intl.formatMessage({
                id: 'streetNumber',
                defaultMessage: 'Street Number'
              })}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="zipCode"
              label={intl.formatMessage({
                id: 'zipCode',
                defaultMessage: 'Zip Code'
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseEnterZipCode',
                    defaultMessage: 'Please enter your zip code'
                  })
                },
                {
                  pattern: /^\d{2,10}$/g,
                  message: intl.formatMessage({
                    id: 'pleaseProvideValidDigitNumbers',
                    defaultMessage: 'Please provide valid digit numbers'
                  })
                }
              ]}
            >
              <Input placeholder={intl.formatMessage({
                id: 'zipCode',
                defaultMessage: 'Zip Code'
              })}
              />
            </Form.Item>
          </Col>
          <Col md={24} xs={24}>
            <Form.Item
              name="description"
              label={intl.formatMessage({
                id: 'description',
                defaultMessage: 'Description'
              })}
            >
              <Input.TextArea placeholder={intl.formatMessage({
                id: 'description',
                defaultMessage: 'Description'
              })}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="text-center">
          <Button
            htmlType="submit"
            className="primary"
            type="primary"
            loading={submiting}
            disabled={submiting}
          >
            {submiting ? (
              <span className="loader" />
            ) : (
              <span>{intl.formatMessage({ id: 'saveChanges', defaultMessage: 'Save Changes' })}</span>
            )}
          </Button>
          &nbsp;
          <button
            type="button"
            className="cancel-button"
            onClick={() => onCancel()}
          >
            <span>{intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}</span>
          </button>
        </div>
        <Divider>
          {addresses.length > 0 && addresses.length}
          {' '}
          {intl.formatMessage({
            id: 'addresses',
            defaultMessage: 'Addresses'
          })}
        </Divider>
        <List
          header={null}
          footer={null}
          bordered={false}
          dataSource={addresses}
          renderItem={(a) => (
            <List.Item key={a._id} className="white-color" style={{ color: '#fff' }}>
              <button className="delete-button" type="button" onClick={() => deleteAddress(a._id)}>
                <span>
                  <AiOutlineDelete />
                </span>
              </button>
              <span>
            &nbsp;
                {a.name}
                {' '}
                -
                {' '}
                <small>{`${a.streetNumber || ''} ${a.streetAddress || ''} ${a.ward || ''} ${a.district || ''} ${a.city || ''} ${a.state || ''} ${a.zipCode || ''} ${a.country || ''}`}</small>
              </span>
            </List.Item>
          )}
        />
      </Form>
    </div>
  );
}
