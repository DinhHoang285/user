'use client';

import { IFeed, IUser } from '@interfaces/index';
import { showError, showSuccess } from '@lib/message';
import { tokenTransactionService } from '@services/token-transaction.service';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const PurchaseProductForm = dynamic(() => import('../confirm-purchase'), { ssr: false });

type Props = {
  product: IFeed;
  onSuccess?: Function;
};

function PurchaseProductBtn({ product, onSuccess = () => { } }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const { data: session, update: updateBalance } = useSession();
  const user: IUser = session?.user as IUser;
  const loggedIn = !!session?.user;
  const router = useRouter();
  const intl = useIntl();

  const onClick = () => {
    if (!loggedIn) {
      showError(
        intl.formatMessage({
          id: 'pleaseLogIn',
          defaultMessage: 'Please log in!'
        })
      );
      return;
    }
    if (user.isPerformer) {
      showError(
        intl.formatMessage({
          id: 'creatorsCannotPurchase',
          defaultMessage: 'Creators cannot purchase their own products!'
        })
      );
      return;
    }
    if (product.productType === 'physical' && !product.stock) {
      showError(
        intl.formatMessage({
          id: 'outOfStockComeback',
          defaultMessage: 'Out of stock, please comeback later!'
        })
      );
      return;
    }
    if (user.balance < product.price) {
      showError(
        intl.formatMessage({
          id: 'youHaveAnInsufficientWalletBalance',
          defaultMessage: 'You have an insufficient wallet balance. Please top up.'
        })
      );
      router.push('/wallet');
      return;
    }
    setOpenModal(true);
  };

  const purchaseProduct = async (payload) => {
    try {
      if (product.productType === 'physical' && !payload.deliveryAddressId) {
        showError(
          intl.formatMessage({
            id: 'pleaseSelectOrCreateDeliveryAddress',
            defaultMessage: 'Please select or create a delivery address!'
          })
        );
        return;
      }
      setRequesting(true);
      const res = await tokenTransactionService.purchaseFeed(product._id, payload);
      showSuccess(
        intl.formatMessage({
          id: 'paymentSuccess',
          defaultMessage: 'Payment success!'
        })
      );
      router.push('/user/orders');
      updateBalance({
        info: { ...session?.user, balance: Number(session?.user.balance) - Number(product.price * product.quantity) }
      });
      onSuccess && onSuccess(res.data);
      setOpenModal(false);
    } catch (e) {
      showError(e);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <>
      <Button disabled={!loggedIn || requesting} className="primary" onClick={onClick}>
        {intl.formatMessage({
          id: 'purchaseNow',
          defaultMessage: 'Purchase Now!'
        })}
      </Button>
      {openModal && (
        <Modal
          key="purchase-product"
          width={660}
          title={null}
          open={openModal}
          onOk={() => setOpenModal(false)}
          footer={null}
          onCancel={() => setOpenModal(false)}
          destroyOnClose
          centered
        >
          <PurchaseProductForm product={product} submiting={requesting} onFinish={purchaseProduct} />
        </Modal>
      )}
    </>
  );
}

PurchaseProductBtn.defaultProps = {
  onSuccess: () => { }
};

export default PurchaseProductBtn;
