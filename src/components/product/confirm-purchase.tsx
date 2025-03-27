/* eslint-disable no-param-reassign */

'use client';

import { IAddress, IFeed } from '@interfaces/index';
import { showError } from '@lib/message';
import {
  Button, Form, Input, InputNumber,
  Select
} from 'antd';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import { shippingAddressService } from 'src/services';
import ImageWithFallback from '@components/common/images/image-fallback';
import style from './confirm-purchase.module.scss';
import { ShippingAddressForm } from './shipping-address-form';

interface IProps {
  submiting: boolean;
  product: IFeed;
  onFinish: Function;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default function PurchaseProductForm({
  submiting, product, onFinish
}: IProps) {
  const image = product?.files[0].url || '/no-image.jpg';
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState<any>([]);
  const [isNewAddress, setNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formRef] = Form.useForm();
  const intl = useIntl();

  const handleChangeQuantity = (q: number) => {
    // eslint-disable-next-line no-param-reassign
    q = Math.round(q);
    if (q < 1) {
      setQuantity(1);
      return;
    }
    if (product.stock < q) {
      showError(intl.formatMessage({
        id: 'quantityOurProductStock',
        defaultMessage: 'Quantity is out of product stock!'
      }));
      return;
    }
    setQuantity(q);
  };

  const getAddresses = async () => {
    const resp = await shippingAddressService.search({ limit: 10 });
    setAddresses(resp?.data?.data || []);
  };

  const addNewAddress = async (payload: any) => {
    try {
      setLoading(true);
      const country = COUNTRIES.find((c) => c.code === payload.country);
      const data = { ...payload, country: country.name };
      const resp = await shippingAddressService.create(data);
      addresses.unshift(resp.data);
      setLoading(false);
      setNewAddress(false);
    } catch (e) {
      showError(e);
      setLoading(false);
      setNewAddress(false);
    }
  };

  const onRemoveAddress = (addressId: string) => {
    formRef.setFieldsValue({ deliveryAddressId: '' });
    setAddresses((items) => items.filter((i) => i._id !== addressId));
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <>
      {!isNewAddress && (
        <div className="text-center">
          <h3>
            {intl.formatMessage({
              id: 'confirmPurchase',
              defaultMessage: `Confirm purchase: ${product?.title}`
            }, { name: product?.title })}
          </h3>
          <ImageWithFallback
            options={{
              unoptimized: true,
              style: {
                width: '100%',
                borderRadius: '5px',
                objectFit: 'cover'
              },
              sizes: '25vw'
            }}
            alt="p-avt"
            src={image}
          />
        </div>
      )}
      {!isNewAddress && (
        <Form
          form={formRef}
          {...layout}
          onFinish={(val) => onFinish(val)}
          name="form-order"
          initialValues={{
            quantity: 1,
            userNote: '',
            phoneNumber: ''
          }}
          style={{
            marginTop: '16px'

          }}
        >
          {product.productType === 'physical' && (
            <>
              <Form.Item
                name="quantity"
                rules={[{
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseInputQuantity',
                    defaultMessage: 'Please input the quantity'
                  })
                }]}
                label={intl.formatMessage({
                  id: 'quantiry',
                  defaultMessage: 'Quantity'
                })}
              >
                <InputNumber
                  formatter={(value) => `${Math.round(value)}`}
                  precision={1}
                  onChange={handleChangeQuantity}
                  min={1}
                  max={product.stock}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="deliveryAddressId"
                rules={[{
                  required: true,
                  message: intl.formatMessage({
                    id: 'pleaseSelectDeliveryAddress',
                    defaultMessage: 'Please select your delivery address!'
                  })
                }]}
                label={(
                  <div>
                    {intl.formatMessage({
                      id: 'deliveryAddress',
                      defaultMessage: 'Delivery address'
                    })}
                    {' '}
                    {addresses.length < 10 && (
                      <a onClick={() => setNewAddress(true)} aria-hidden>
                        <span>
                          <AiOutlinePlus style={{ fontSize: 22 }} />
                        </span>
                      </a>
                    )}
                  </div>
                )}
              >
                <Select defaultActiveFirstOption onChange={(val: string) => formRef.setFieldsValue({ deliveryAddressId: val })}>
                  {addresses.map((a: IAddress) => (
                    <Select.Option value={a._id} key={a._id}>
                      <div className={style['address-option']}>
                        {a.name}
                        {' '}
                        -
                        {' '}
                        <small>{`${a.streetNumber} ${a.streetAddress} ${a.ward} ${a.district} ${a.city} ${a.state} ${a.zipCode} ${a.country}`}</small>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label={intl.formatMessage({
                  id: 'phoneNumber',
                  defaultMessage: 'Phone Number'
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pleaseEnterPhoneNumber',
                      defaultMessage: 'Please enter your phone number!'
                    })
                  },
                  {
                    // eslint-disable-next-line prefer-regex-literals
                    pattern: new RegExp(/^([+]\d{2,4})?\d{9,12}$/g),
                    message: intl.formatMessage({
                      id: 'pleaseProvideValidDigitNumbers',
                      defaultMessage: 'Please provide valid digit numbers'
                    })
                  }
                ]}
              >
                <Input placeholder={intl.formatMessage({
                  id: 'phoneNumber',
                  defaultMessage: 'Phone Number'
                })}
                />
              </Form.Item>
              <Form.Item
                name="userNote"
                label={intl.formatMessage({
                  id: 'comment',
                  defaultMessage: 'Comment'
                })}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </>
          )}
          <div className="text-center">
            <Button
              htmlType="submit"
              className="primary"
              type="primary"
              block
              loading={submiting}
              disabled={submiting || (product.productType === 'physical' && product.stock < quantity)}
            >
              {intl.formatMessage({
                id: 'confirmPurchase',
                // eslint-disable-next-line no-template-curly-in-string
                defaultMessage: `Confirm purchase for €${(quantity * product.price).toFixed(2)}`
              }, {
                price: (quantity * product.price).toFixed(2)
              })}
            </Button>
          </div>
        </Form>
      )}
      {
        isNewAddress && (
          <div className="text-center">
            <h3 className="secondary-color">
              {intl.formatMessage({
                id: 'saveAddressFutureUse',
                defaultMessage: 'Save your address for the future use'
              })}
            </h3>
          </div>
        )
      }
      {
        isNewAddress && (
          <ShippingAddressForm
            onRemoveAddress={onRemoveAddress}
            addresses={addresses}
            onCancel={() => setNewAddress(false)}
            submiting={loading}
            onFinish={addNewAddress}
          />
        )
      }
    </>
  );
}
