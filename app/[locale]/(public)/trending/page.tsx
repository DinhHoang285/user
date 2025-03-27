import TrendingPage from '@components/trending/trending-container';
import { Metadata } from 'next';

export default function Trending() {
  return (
    <TrendingPage />
  );
}

export const metadata: Metadata = {
  title: 'Trending',
  robots: 'noindex'
};
