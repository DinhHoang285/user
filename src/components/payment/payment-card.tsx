import { AiOutlineDelete } from 'react-icons/ai';
import { IPaymentCard } from '@interfaces/payment';
import { renderCardIcon } from '@lib/image';
import { paymentService } from '@services/payment.service';
import { Button } from 'antd';
import { useState } from 'react';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';
import style from './payment-card.module.scss';

interface P {
  card: IPaymentCard;
  onRemove: Function;
}

export function PaymentCard({ onRemove, card }: P) {
  const [submitting, setSubmitting] = useState(false);
  const intl = useIntl();

  return (
    <div className={style['card-item']} key={card._id}>
      <Button
        className={style['remove-btn']}
        type="link"
        disabled={submitting}
        onClick={async () => {
          if (
            !window.confirm(
              intl.formatMessage({
                id: 'confirmRemoveCard',
                defaultMessage: 'Are you sure to remove this payment card?'
              })
            )
          ) return;
          try {
            setSubmitting(true);
            await paymentService.removeCard(card._id);
            onRemove(card._id);
          } catch (e) {
            showError(e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <AiOutlineDelete />
      </Button>
      <div className={style['card-holder-name']}>
        {card.holderName
          || intl.formatMessage({
            id: 'unknown',
            defaultMessage: 'Unknown'
          })}
        <span className={style['card-brand']}>
          {renderCardIcon(card.brand || '')}
        </span>
      </div>
      <div className={style['card-info']}>
        <span className={style['card-last-number']}>
          {`**** **** **** ${card.last4Digits || ''}`}
        </span>
        <small>{`${card.month}/${card.year}`}</small>
      </div>
    </div>
  );
}
