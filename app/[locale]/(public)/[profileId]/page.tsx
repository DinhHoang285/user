import ProfileContainer from '@components/performer/profile-wrapper';
import { IPage } from '@interfaces/ui-config';
import { getIpFromHeaders } from '@lib/request-header';
import { TOKEN } from '@services/api-request';
import { performerService } from '@services/performer.service';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import ViewMediaPopupContainer from 'src/providers/view-media-popup/provider';

export async function generateMetadata(props: IPage): Promise<Metadata> {
  try {
    const params = await props.params;
    const { data: performer } = await performerService.findOne(params.profileId, {
      Authorization: '',
      'x-client-ip': '127.0.0.1'
    });
    if (!performer) {
      return {
        robots: {
          index: false,
          follow: false
        }
      };
    }

    const metadata = {
      title: performer.name || performer.username,
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

export default async function CreatorProfile({ params }: IPage) {
  try {
    const { profileId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN)?.value || '';
    const headersList = await headers();
    const xClientIp = getIpFromHeaders(headersList);
    const [{ data: performer }] = await Promise.all([
      performerService.findOne(profileId, {
        Authorization: token,
        'x-client-ip': xClientIp
      })
    ]);

    if (!performer) {
      notFound();
    }

    return (
      <ViewMediaPopupContainer>
        <ProfileContainer
          performer={performer}
        />
      </ViewMediaPopupContainer>
    );
  } catch {
    notFound();
  }
}
