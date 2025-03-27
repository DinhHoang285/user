import { bannerService } from '@services/banner.service';
import { Banners } from '@components/common';
import FeedContainer from '@components/feed/container';

async function getData() {
  const { data: banners } = await bannerService.search({ limit: 99 });
  return banners;
}

async function FeedPage() {
  const banners = await getData();
  const topBanners = banners && banners.length > 0 ? banners.filter((b) => b.position === 'top') : [];

  return (
    <>
      <Banners banners={topBanners} />
      <FeedContainer />
    </>
  );
}

export default FeedPage;
