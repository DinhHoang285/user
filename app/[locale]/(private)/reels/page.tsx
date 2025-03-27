import ReelScrollWrapper from '@components/reels/scroll-wrapper';
import { getIpFromHeaders } from '@lib/request-header';
import { TOKEN } from '@services/api-request';
import { feedService } from '@services/feed.service';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';

export default async function Reels({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value || '';
  const headersList = await headers();
  const xClientIp = getIpFromHeaders(headersList);
  const { data } = await feedService.userSearch(
    {
      includedId: params?.includedId || '',
      isAd: params?.isAd || '',
      performerId: params?.performerId || '',
      limit: 5,
      offset: 0,
      type: 'reel'
    },
    {
      Authorization: token,
      'x-client-ip': xClientIp
    }
  );
  return (
    <div className="main-container large">
      <ReelScrollWrapper initVideos={data} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Reels',
  robots: 'noindex'
};
