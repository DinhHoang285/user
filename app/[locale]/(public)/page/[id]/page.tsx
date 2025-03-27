import StaticPostWrapper from '@components/static-post/wrapper';
import { IPage } from '@interfaces/ui-config';
import { postService } from '@services/post.service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Page(props: IPage) {
  const params = await props.params;
  const { data: post } = await postService.findById(params.id);
  if (!post) {
    notFound();
  }
  return (
    <div className="main-container">
      <StaticPostWrapper post={post} />
    </div>
  );
}

export async function generateMetadata(props: IPage): Promise<Metadata> {
  try {
    const params = await props.params;
    const { data: post } = await postService.findById(params?.id);
    if (!post) {
      return {
        robots: {
          index: false,
          follow: false
        }
      };
    }

    const metadata = {
      title: post.title,
      description: post.shortDescription
    };
    const canonicalUrl = `${process.env.SITE_URL}/page/${post.slug}`;

    return {
      ...metadata,
      metadataBase: new URL(process.env.SITE_URL),
      alternates: {
        canonical: canonicalUrl
      },
      twitter: {
        ...metadata,
        card: 'summary',
        images: []
      },
      openGraph: {
        ...metadata,
        images: [],
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
