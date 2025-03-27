'use client';

import { ShippingAddressForm } from '@components/product/shipping-address-form';
import { showError, showSuccess } from '@lib/message';
import {
  Descriptions, Modal, Select, Tag
} from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { COUNTRIES } from 'src/constants/countries';
import { IAddress, IOrder } from 'src/interfaces';
import { orderService, shippingAddressService } from 'src/services';
import style from './order-details-wrapper.module.scss';

const { Item } = Descriptions;

interface OrderDetailsWrapperProps {
  order: IOrder;
}

export default function OrderDetailsWrapper({ order }: OrderDetailsWrapperProps) {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [onEditAddress, setOnEditAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);
  const intl = useIntl();
  const router = useRouter();
  const pathname = usePathname();

  const getAddresses = async () => {
    try {
      const resp = await shippingAddressService.search({ limit: 10 });
      setAddresses(resp?.data?.data || []);
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const downloadFile = async () => {
    try {
      const resp = await orderService.getDownloadLinkDigital(order.productId);
      window.open(resp?.data?.downloadLink, '_blank');
    } catch (e) {
      showError(e);
    }
  };

  const onUpdateDeliveryAddress = async (deliveryAddressId: string) => {
    try {
      await orderService.updateDeliveryAddress(order._id, { deliveryAddressId });
      showSuccess(
        intl.formatMessage({
          id: 'updateSuccess',
          defaultMessage: 'Updated delivery address successfully!'
        })
      );
      router.replace(pathname);
    } catch (e) {
      showError(e);
    } finally {
      setOnEditAddress(false);
    }
  };

  const addNewAddress = async (payload: any) => {
    try {
      setSubmitting(true);
      const country = COUNTRIES.find((c) => c.code === payload.country);
      const data = { ...payload, country: country?.name };
      const resp = await shippingAddressService.create(data);
      setAddresses([resp.data, ...addresses]);
    } catch (e) {
      showError(e);
    } finally {
      setOpenAddAddressModal(false);
      setSubmitting(false);
    }
  };

  const onRemoveAddress = (addressId: string) => {
    setAddresses((items) => items.filter((i) => i._id !== addressId));
  };

  return (
    <div className={style['my-order-container']}>
      <div className={style['my-order-detail']}>
        <Descriptions>
          <Item key="seller" label={intl.formatMessage({ id: 'creator', defaultMessage: 'Creator' })}>
            {order?.performerInfo?.name || order?.performerInfo?.username || 'N/A'}
          </Item>
          <Item key="name" label={intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}>
            {order?.productInfo?.name || 'N/A'}
          </Item>
          <Item key="description" label={intl.formatMessage({ id: 'description', defaultMessage: 'Description' })}>
            {order?.productInfo?.description || 'N/A'}
          </Item>
          <Item key="unitPrice" label={intl.formatMessage({ id: 'unitPrice', defaultMessage: 'Unit price' })}>
            €
            {(order?.unitPrice || 0).toFixed(2)}
          </Item>
          <Item key="quantiy" label={intl.formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}>
            {order?.quantity || '0'}
          </Item>
          <Item key="totalPrice" label={intl.formatMessage({ id: 'totalPrice', defaultMessage: 'Total Price' })}>
            €
            {(order?.totalPrice || 0).toFixed(2)}
          </Item>
        </Descriptions>
        {order?.productInfo?.type === 'digital' ? (
          <div>
            {order?.deliveryStatus === 'delivered' ? (
              <div style={{ marginBottom: '10px' }}>
                {intl.formatMessage({ id: 'downloadLink', defaultMessage: 'Download Link' })}
                :
                {' '}
                <a aria-hidden onClick={downloadFile}>
                  {intl.formatMessage({ id: 'clickToDownload', defaultMessage: 'Click to download' })}
                </a>
              </div>
            ) : (
              <div style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
                {intl.formatMessage({ id: 'deliveryStatus', defaultMessage: 'Delivery Status' })}
                :
                {' '}
                <Tag color="green">{order?.deliveryStatus || 'N/A'}</Tag>
              </div>
            )}
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: '0', color: 'var(--black)' }}>
              {intl.formatMessage({
                id: 'deliveryInformation',
                defaultMessage: 'Delivery information'
              })}
            </h3>
            <Descriptions>
              <Item
                key="seller"
                label={intl.formatMessage({ id: 'deliveryAddress', defaultMessage: 'Delivery Address' })}
              >
                {!onEditAddress ? (
                  order?.deliveryAddress
                ) : (
                  <Select
                    style={{ minWidth: 250 }}
                    defaultValue={order?.deliveryAddressId}
                    onChange={(id) => onUpdateDeliveryAddress(id)}
                    className={style['select-edit-address']}
                  >
                    {addresses.map((a: IAddress) => (
                      <Select.Option value={a._id} key={a._id}>
                        <div style={{ position: 'relative', paddingRight: 30, color: 'var(--black)' }}>
                          {a.name}
                          {' '}
                          -
                          {' '}
                          <small>
                            {`${a.streetNumber || ''} ${a.streetAddress || ''}, ${a.ward || ''}, ${a.district || ''}, ${a.city || ''}, ${a.state || ''} (${a.zipCode || ''}), ${a.country}`}
                          </small>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                )}
                &nbsp;&nbsp;
                {order?.deliveryStatus === 'processing' && (
                  <div>
                    {!onEditAddress ? (
                      <a aria-hidden onClick={() => setOnEditAddress(true)}>
                        <AiOutlineEdit style={{ transform: 'translateY(3px)' }} />
                        {' '}
                        {intl.formatMessage({ id: 'change', defaultMessage: 'Change' })}
                      </a>
                    ) : (
                      <div>
                        {addresses.length < 10 && (
                          <a aria-hidden onClick={() => setOpenAddAddressModal(true)}>
                            <AiOutlinePlus style={{ transform: 'translateY(3px)' }} />
                            {' '}
                            {intl.formatMessage({ id: 'addNewAddress', defaultMessage: 'Add New Address' })}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Item>
            </Descriptions>
            <Descriptions>
              <Item
                key="phone"
                label={intl.formatMessage({ id: 'phoneNumber', defaultMessage: 'Phone Number' })}
              >
                {order?.phoneNumber || 'N/A'}
              </Item>
              <Item
                key="shipping"
                label={intl.formatMessage({ id: 'shippingCode', defaultMessage: 'Shipping Code' })}
              >
                <Tag
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '205px',
                    whiteSpace: 'normal',
                    border: 'none',
                    color: '#1ea2f1',
                    verticalAlign: 'middle'
                  }}
                >
                  {order?.shippingCode || 'N/A'}
                </Tag>
              </Item>
              <Item
                key="delivery"
                label={intl.formatMessage({ id: 'deliveryStatus', defaultMessage: 'Delivery Status' })}
              >
                <Tag color="green">{order?.deliveryStatus || 'N/A'}</Tag>
              </Item>
            </Descriptions>
          </>
        )}
      </div>
      <div className="text-center" style={{ margin: '20px 0' }}>
        <button type="button" className="primary-button" onClick={() => router.back()}>
          {intl.formatMessage({ id: 'back', defaultMessage: 'Back' })}
        </button>
      </div>
      {openAddAddressModal && (
        <Modal
          key="add-new-address"
          width={660}
          title={null}
          open={openAddAddressModal}
          onOk={() => setOpenAddAddressModal(false)}
          footer={null}
          onCancel={() => setOpenAddAddressModal(false)}
          destroyOnClose
          centered
        >
          <ShippingAddressForm
            addresses={addresses || []}
            onRemoveAddress={onRemoveAddress}
            onCancel={() => setOpenAddAddressModal(false)}
            submiting={submitting}
            onFinish={addNewAddress}
          />
        </Modal>
      )}
    </div>
  );
}
