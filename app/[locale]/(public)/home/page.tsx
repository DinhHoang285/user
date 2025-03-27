import { featuredService } from '@services/featured.service';
import { performerService } from '@services/performer.service';
import { Metadata } from 'next';
import HomeMainContainer from 'src/components/home/home-container';

async function getData() {
  const [reels, performers, featureds] = await Promise.all([
    featuredService.getFeaturedFeed({ limit: 4, isTrash: false, type: 'reel' }),
    performerService.search({ sortBy: 'createdAt', sort: -1, limit: 4 }),
    featuredService.getFeaturedFeed({ limit: 4, isTrash: false })
  ]);

  return {
    reels: reels.data.data,
    performers: performers.data.data,
    featureds: featureds.data.data
  };
}

export default async function Home() {
  const { reels, performers, featureds } = await getData();

  return (
    <HomeMainContainer
      reels={reels}
      performers={performers}
      featureds={featureds}
    />
  );
}

export const metadata: Metadata = {
  title: 'Home'
};
