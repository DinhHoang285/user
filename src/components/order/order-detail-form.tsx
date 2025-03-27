'use client';

import { showError, showSuccess } from '@lib/message';
import {
  Alert, Button, Descriptions, Input,
  Select, Tag
} from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IOrder } from 'src/interfaces';
import { orderService } from 'src/services';
import style from './order-detail-form.module.scss';

const { Item } = Descriptions;

function getTagColor(deliveryStatus: string) {
  let color = '';
  switch (deliveryStatus) {
    case 'created':
      color = 'gray';
      break;
    case 'processing':
      color = '#FFCF00';
      break;
    case 'shipping':
      color = '#00dcff';
      break;
    case 'delivered':
      color = '#00c12c';
      break;
    case 'refunded':
      color = 'red';
      break;
    default:
      break;
  }
  return color;
}

interface OrderDetailFormProps {
  order: IOrder;
}

export default function OrderDetailForm({ order }: OrderDetailFormProps) {
  const intl = useIntl();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [shippingCode, setShippingCode] = useState(order.shippingCode);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);

  const onUpdate = async () => {
    if (!shippingCode && deliveryStatus !== 'refunded') {
      showError(
        intl.formatMessage({
          id: 'myOrderMissingShipCode',
          defaultMessage: 'Missing shipping code!'
        })
      );
      return;
    }
    try {
      setSubmitting(true);
      await orderService.update(order._id, { deliveryStatus, shippingCode });
      showSuccess(
        intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved.' })
      );
      router.back();
    } catch (e) {
      showError(e);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setShippingCode(order.shippingCode);
    setDeliveryStatus(order.deliveryStatus);
  }, [order]);

  return (
    <>
      <div className={classNames(style['my-order-detail'])}>
        <Descriptions>
          <Item
            key="name"
            label={intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}
          >
            {order?.productInfo?.name || 'N/A'}
          </Item>
          <Item
            key="description"
            label={intl.formatMessage({ id: 'description', defaultMessage: 'Description' })}
          >
            {order?.productInfo?.name || 'N/A'}
          </Item>
          <Item
            key="productType"
            label={intl.formatMessage({ id: 'productType', defaultMessage: 'Product type' })}
          >
            <Tag color="orange" style={{ textTransform: 'capitalize' }}>
              {order?.productInfo?.type || 'N/A'}
            </Tag>
          </Item>
          <Item
            key="unitPrice"
            label={intl.formatMessage({ id: 'unitPrice', defaultMessage: 'Unit price' })}
          >
            €
            {order.unitPrice}
          </Item>
          <Item
            key="quantiy"
            label={intl.formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}
          >
            {order?.quantity || '0'}
          </Item>
          <Item
            key="originalPrice"
            label={intl.formatMessage({ id: 'totalPrice', defaultMessage: 'Total Price' })}
          >
            €
            {order.totalPrice}
          </Item>
        </Descriptions>

        {order?.productInfo?.type === 'physical' ? (
          <div className={style['content-order-detail']}>
            <div style={{ marginBottom: '10px' }}>
              {intl.formatMessage({ id: 'phoneNumber', defaultMessage: 'Phone Number' })}
              {' '}
              {order.phoneNumber || 'N/A'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              {intl.formatMessage({ id: 'deliveryAddress', defaultMessage: 'Delivery Address' })}
              {' '}
              {order.deliveryAddress || 'N/A'}
            </div>
            <Alert
              type="warning"
              message={intl.formatMessage({
                id: 'updateShippingCode',
                defaultMessage: 'Update shipping code & delivery status below!'
              })}
            />
            <div style={{ marginBottom: '10px' }}>
              {intl.formatMessage({ id: 'shippingCode', defaultMessage: 'Shipping Code' })}
              <Input
                placeholder={intl.formatMessage({
                  id: 'enterShippingCode',
                  defaultMessage: 'Enter shipping code here'
                })}
                defaultValue={order.shippingCode}
                onChange={(e) => setShippingCode(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              {intl.formatMessage({
                id: 'deliveryStatus',
                defaultMessage: 'Delivery Status'
              })}
              {' '}
              <Select
                onChange={(value) => setDeliveryStatus(value)}
                defaultValue={order.deliveryStatus}
                disabled={submitting || order.deliveryStatus === 'refunded'}
                style={{ minWidth: '120px' }}
              >
                <Select.Option key="processing" value="processing">
                  {intl.formatMessage({
                    id: 'processing',
                    defaultMessage: 'Processing'
                  })}
                </Select.Option>
                <Select.Option key="shipping" value="shipping">
                  {intl.formatMessage({
                    id: 'shipping',
                    defaultMessage: 'Shipping'
                  })}
                </Select.Option>
                <Select.Option key="delivered" value="delivered">
                  {intl.formatMessage({
                    id: 'delivered',
                    defaultMessage: 'Delivered'
                  })}
                </Select.Option>
                <Select.Option key="refunded" value="refunded">
                  {intl.formatMessage({
                    id: 'refunded',
                    defaultMessage: 'Refunded'
                  })}
                </Select.Option>
              </Select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Button
                className="primary"
                onClick={onUpdate}
                loading={submitting}
                disabled={submitting}
              >
                {intl.formatMessage({ id: 'update', defaultMessage: 'Update' })}
              </Button>
              <Button
                className="secondary"
                onClick={() => router.back()}
                disabled={submitting}
              >
                {intl.formatMessage({ id: 'back', defaultMessage: 'Back' })}
              </Button>
            </div>
          </div>
        ) : (
          <div className={style['my-order-tags']}>
            {intl.formatMessage({
              id: 'deliveryStatus',
              defaultMessage: 'Delivery Status'
            })}
            {' '}
            <Tag color={getTagColor(order.deliveryStatus)}>{order.deliveryStatus}</Tag>
          </div>
        )}
      </div>
      <div className="text-center">
        <Button
          className="primary"
          onClick={() => router.push('/my-order')}
        >
          {intl.formatMessage({ id: 'back', defaultMessage: 'Back' })}
        </Button>
      </div>
    </>
  );
}
