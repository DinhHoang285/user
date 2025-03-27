import FeedDetailWrapper from '@components/feed/detail/feed-detail-wrapper';
import { IPage } from '@interfaces/ui-config';
import { getIpFromHeaders } from '@lib/request-header';
import { TOKEN } from '@services/api-request';
import { feedService } from '@services/feed.service';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: IPage): Promise<Metadata> {
  try {
    const params = await props.params;
    const { data: post } = await feedService.findOne(params.id, {
      Authorization: '',
      'x-client-ip': '127.0.0.1'
    });
    if (!post || !post.performer) {
      return {
        robots: {
          index: false,
          follow: false
        }
      };
    }
    const { performer } = post;
    const metadata = {
      title: post?.slug || performer.name || performer.username,
      description: performer.bio ? performer.bio.slice(0, 165) : 'No about yet'
    };
    const canonicalUrl = `${process.env.SITE_URL}/${performer.username}`;

    return {
      ...metadata,
      metadataBase: new URL(process.env.SITE_URL),
      alternates: {
        canonical: canonicalUrl
      },
      twitter: {
        ...metadata,
        card: 'summary',
        images: [(performer.avatar || '/no-avatar.jpg')]
      },
      openGraph: {
        ...metadata,
        images: [(performer.avatar || '/no-avatar.jpg')],
        url: canonicalUrl
      },
      robots: {
        index: true,
        follow: true
      }
    };
  } catch {
    return {
      robots: {
        index: false,
        follow: false
      }
    };
  }
}

export default async function PostDetails(props: IPage) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value || '';
  const headersList = await headers();
  const xClientIp = getIpFromHeaders(headersList);
  const params = await props.params;

  const { data: feed } = await feedService.findOne(params.id, {
    Authorization: token,
    'x-client-ip': xClientIp
  });

  if (!feed || !feed.performer) {
    return notFound();
  }

  return (
    <FeedDetailWrapper feed={feed} />
  );
}
