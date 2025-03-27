import PerformersWrapper from '@components/performer/list-wrapper';
import { Metadata } from 'next';

export default async function Performers() {
  return (
    <div className="main-container">
      <PerformersWrapper />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Creators'
};
