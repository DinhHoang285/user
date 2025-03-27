import CollectionContainer from '@components/collection/collection-container';
import { IPage } from '@interfaces/ui-config';
import { collectionService } from '@services/collection.service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Collection(props: IPage) {
  try {
    const params = await props.params;

    const { data: collection } = await collectionService.searchByIdPerformer(params.id);

    if (!collection) {
      notFound();
    }
    return (
      <CollectionContainer collection={collection} performerId={params.id} />
    );
  } catch {
    notFound();
  }
}

export const metadata: Metadata = {
  title: 'Edit Video'
};
