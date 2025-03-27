import PageHeading from '@components/common/page-heading';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import {
  feedService
} from '@services/index';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { TOKEN } from '@services/api-request';
import FeedForm from '@components/feed/form/feed-form';
import { IPage } from '@interfaces/ui-config';

const getData = async (dataId) => {
  let item = null;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN)?.value || '';

  try {
    item = await feedService.findById(dataId as string, {
      Authorization: token || ''
    });
  } catch {
    item = null;
  }

  return {
    dataEdit: item.data
  };
};

export default async function EditPost(props: IPage) {
  try {
    const params = await props.params;

    const { dataEdit } = await getData(params.id);

    if (!dataEdit) {
      notFound();
    }

    return (
      <div className="main-container">
        <PageHeading icon={<AiOutlineArrowLeft />} title="Edit Post" />
        <div>
          <FeedForm feed={dataEdit} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

export const metadata: Metadata = {
  title: 'Edit Post'
};
