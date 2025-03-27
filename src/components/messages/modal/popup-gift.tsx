'use client';

/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { IConversation } from '@interfaces/message';
import { IUser } from '@interfaces/user';
import { showError, showSuccess } from '@lib/message';
import { giftService } from '@services/gift.service';
import { tokenTransactionService } from '@services/token-transaction.service';
import { Tabs, TabsProps } from 'antd';
import { uniqueId } from 'lodash';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styles from './popup-gift.module.scss';

interface IProp {
  setShowPopupGift: Function;
  conversation: IConversation;
  onNewMessage?: Function;
}

function PopupGift({ setShowPopupGift, conversation, onNewMessage }: IProp) {
  const [dataTab, setDataTab] = useState([]);
  const { data: session, update: updateBalance } = useSession();
  const user: IUser = session?.user as IUser;
  const intl = useIntl();

  const handedSendGift = async (giftParants, gift) => {
    const confirmMessage = intl.formatMessage({
      id: 'doYouConfirmSendingGifts?',
      defaultMessage: 'Do you confirm sending gifts?'
    });
    const userResponse = window.confirm(confirmMessage);
    if (userResponse) {
      if (gift.price > user.balance) {
        showError(
          intl.formatMessage({
            id: 'insufficientWalletBalance',
            defaultMessage: 'The amount in your wallet is not enough, please add more money to your account.'
          })
        );
        return;
      }
      try {
        await tokenTransactionService.sendGift(giftParants._id, {
          price: Number(gift.price),
          conversationId: conversation._id,
          performerId: conversation.recipientInfo._id,
          group: gift.group,
          idGift: gift._id
        });
        showSuccess(
          intl.formatMessage({
            id: 'thanksYouForTheGift',
            defaultMessage: 'Thank you for the gift'
          })
        );
        const cloneMessageGift = {
          conversationId: conversation._id,
          isSale: false,
          createdAt: new Date(),
          fileIds: [gift._id],
          isBought: true,
          files: [
            {
              url: gift.iconUrl,
              type: 'gift'
            }
          ],
          price: 0,
          senderId: user._id,
          text: intl.formatMessage(
            {
              id: 'giftSentNotification',
              defaultMessage: `${user.name} has just sent you a gift`
            },
            { username: user.name || user.username }
          ),
          type: 'gift',
          _id: uniqueId()
        };

        onNewMessage(cloneMessageGift);
        updateBalance({ info: { ...session?.user, balance: Number(session?.user.balance) - Number(gift.price) } });
      } catch (error) {
        showError(
          intl.formatMessage({
            id: 'errorOccurred',
            defaultMessage: 'Error occurred, please try again later'
          })
        );
      }
      setShowPopupGift(false);
    }
  };

  const getData = async () => {
    try {
      const resp = await giftService.search({
        sort: 'asc',
        sortBy: 'ordering',
        current: 1,
        pageSize: 10,
        isParants: 'true'
      });
      setDataTab(resp.data.data);
    } catch (error) {
      showError(
        intl.formatMessage({
          id: 'errorOccurred',
          defaultMessage: 'Error occurred, please try again later'
        })
      );
    }
  };

  let items: TabsProps['items'] = [];

  dataTab.length
    ? dataTab.map((tab) => {
      items = [
        ...items,
        {
          key: tab.name,
          label: <img className={styles.imageTab} src={tab.iconUrl} alt={tab.name} />,
          children: (
            <div className={styles['box-list-gift']}>
              <ul>
                {tab.items.length
                    && tab.items.map((gift) => {
                      if (gift.showItem) {
                        return (
                          <li aria-hidden key={gift._id} onClick={() => handedSendGift(tab, gift)}>
                            <img src={gift.iconUrl} alt="" />
                            <p>
                              €
                              {Number(gift.price).toFixed(2)}
                            </p>
                          </li>
                        );
                      }
                    })}
              </ul>
            </div>
          )
        }
      ];
    })
    : [];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Tabs className={styles.container} defaultActiveKey="" items={items} />
    </div>
  );
}

export default PopupGift;
