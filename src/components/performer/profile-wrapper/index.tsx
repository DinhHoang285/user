'use client';

import Collections from '@components/performer/profile-wrapper/contents-tabs/collections';
import ScrollListContent from '@components/performer/profile-wrapper/contents-tabs/scrollListContent';
import SocialRow from '@components/performer/profile-wrapper/contents-tabs/social-row';
import WebcamSchedual from '@components/performer/profile-wrapper/contents-tabs/webcam-schedual';
import { IAdvertisement } from '@interfaces/advertisement';
import { IPerformer } from '@interfaces/performer';
import Footer from '@layouts/footer';
import { advertisementService } from '@services/advertisement.service';
import { collectionService } from '@services/collection.service';
import { giftService } from '@services/gift.service';
import {
  Col, Image, Row
} from 'antd';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useMainThemeLayout } from 'src/providers/main-layout.provider';
import { showError } from '@lib/message';
import { useIntl } from 'react-intl';
import LiveButton from '../buttons/live-button';
import styles from './style.module.scss';
import UserActionsGroup from './contents-tabs/user-actions-group';

const SubscribeButtons = dynamic(() => import('../buttons/subscribe-buttons'));
const AboutPerformer = dynamic(() => import('@components/performer/profile-wrapper/contents-tabs/about-profile'));
const ModalWelcomeVideo = dynamic(() => import('@components/performer/profile-wrapper/contents-tabs/modal-welcome-video'), { ssr: false });
const ListAdBanner = dynamic(() => import('@components/advertisement/banner/ListAdBanner'), { ssr: false });

type IProps = {
  performer: IPerformer;
};

export default function ProfileContainer({
  performer
}: IProps) {
  const [ads, setAds] = useState<IAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState([]);
  const [showCollection, setShowCollection] = useState(true);
  const [dataShowProfile, setDataShowProfile] = useState([]);
  const { data: session } = useSession();
  const user: IPerformer = session?.user as IPerformer;
  const { settings } = useMainThemeLayout();
  const intl = useIntl();

  useEffect(() => {
    if (!performer?._id) return;

    const fetchAds = async () => {
      try {
        setLoading(true);
        const resp = await advertisementService.getProfileBanner(performer._id);
        setAds(resp.data);
        setLoading(false);
      } catch (error) {
        showError(intl.formatMessage({ id: 'failedToFetchAds:', defaultMessage: 'Failed to fetch ads:' }));
        setLoading(false);
      }
    };
    const fetchCollection = async () => {
      try {
        const [{ data: collections }, { data: gifts }] = await Promise.all([
          collectionService.searchByIdPerformer(performer._id, { isShowProfile: true }),
          giftService.search({ limit: 200 })
        ]);

        if (gifts?.data?.length) {
          const dataGiftShowProfile = gifts.data.filter((g) => g.ordering === 0);
          setShowCollection(!!dataGiftShowProfile.length);
          setDataShowProfile(dataGiftShowProfile);
        }
        setCollection(collections[0]?.gifts.length ? collections[0]?.gifts : []);
      } catch (error) {
        showError(intl.formatMessage({ id: 'failedToFetchCollections:', defaultMessage: 'Failed to fetch collections:' }));
      }
    };
    fetchCollection();

    fetchAds();
  }, [performer?._id]);

  return (
    <div className={`${styles['performer-profile']} main-container`}>
      <div>
        <Row>
          <Col xs={24} sm={24} md={16} lg={16}>
            <div className={styles['top-profile']}>
              <Image
                loading="lazy"
                fallback="/default-banner.jpeg"
                src={performer.cover || '/default-banner.jpeg'}
                alt="creator-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 2100px) 50vw"
              />
              <div className={styles['bg-2nd']} />
            </div>
            <div className={styles['main-profile']}>
              <div className={styles['img-name-grp']}>
                <div className={styles['left-col']}>
                  <div className={styles['left-col-photo']}>
                    <Image
                      fallback="/no-avatar.jpg"
                      loading="lazy"
                      src={performer.avatar || '/no-avatar.jpg'}
                      alt="creator-avatar"
                      sizes="(max-width: 768px) 20vw, (max-width: 2100px) 15vw"
                    />
                    <LiveButton performer={performer} />
                  </div>
                </div>
                <UserActionsGroup performer={performer} user={user} />
              </div>
              <AboutPerformer performer={performer} />
              <SocialRow performer={performer} />
              <SubscribeButtons performer={performer} />
            </div>
            <WebcamSchedual performer={performer} />
            {showCollection && <Collections collection={collection} performer={performer} dataShowProfile={dataShowProfile} />}
            <ScrollListContent performer={performer} />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className={styles['right-child']}>
              <SubscribeButtons performer={performer} />
              {settings?.enableAdvertisement && (performer?.acceptAdInProfile || performer?.enablePrivateAd) && ads.length > 0 && (
                <ListAdBanner ads={ads} loading={loading} />
              )}
              <Footer isSideFooter />
            </div>
          </Col>
        </Row>
      </div>
      {!!performer && <ModalWelcomeVideo performer={performer} />}
    </div>
  );
}
