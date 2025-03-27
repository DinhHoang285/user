import { IUser } from '@interfaces/user';
import toast from 'react-hot-toast';

export function showError(e) {
  toast?.error(e?.message || e || 'Error occurred, please try again later!');
}

export function showSuccess(mss: string) {
  toast.success(mss);
}

// TODO - remove it?
/* eslint-disable no-template-curly-in-string */
export const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    range: 'Must be between ${min} and ${max}'
  }
};

export const formatTippedMessage = (lastMessage: string, user: IUser, intl: any) => {
  const regex1 = /^(\w+\s+\w+)\s+tipped\s+-\s+(\d+\.\d+)\s+\.\.\./;
  const regex2 = /^(.*?)\s+tipped\s+-\s+(\d+\.\d+)\s+for\s+you$/;
  if (regex1.test(lastMessage?.trim()) || regex2.test(lastMessage?.trim())) {
    const priceRegex = /\d+\.\d+/;
    const price = parseFloat(lastMessage?.match(priceRegex)[0]);
    return !user.isPerformer
      ? intl.formatMessage({
        id: 'youTipped',
        defaultMessage:
          `You tipped - €${price} for this model`
      }, {
        tip: price
      })
      : intl.formatMessage({
        id: 'tippedForYou',
        defaultMessage: lastMessage
      }, {
        tip: price
      });
  }
  return lastMessage;
};

export const formatGiftMessage = (lastMessage: string, user: IUser, intl: any) => {
  const regex1 = 'just sent you a GIFT';
  if (lastMessage?.includes(regex1)) {
    return !user.isPerformer
      ? intl.formatMessage({
        id: 'youGifted',
        defaultMessage:
          'You just sent a gift to this model'
      })
      : intl.formatMessage({
        id: 'giftedForYou',
        defaultMessage: lastMessage
      });
  }
  return lastMessage;
};

export const formatLastedMessage = (lastMessage: string, user: IUser, intl: any) => {
  const regexTip1 = /^(\w+\s+\w+)\s+tipped\s+-\s+(\d+\.\d+)\s+\.\.\./;
  const regexTip2 = /^(.*?)\s+tipped\s+-\s+(\d+\.\d+)\s+for\s+you$/;
  const regexGift1 = 'just sent you a GIFT';
  if (regexTip1?.test(lastMessage?.trim()) || regexTip2?.test(lastMessage?.trim())) {
    return formatTippedMessage(lastMessage, user, intl);
  }
  if (lastMessage?.includes(regexGift1)) {
    return formatGiftMessage(lastMessage, user, intl);
  }
  return lastMessage;
};
