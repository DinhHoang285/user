import ExplorePage from '@components/explore/explore-container';
import { Metadata } from 'next';

export default function Messages() {
  return (
    <ExplorePage />
  );
}

export const metadata: Metadata = {
  title: 'Explore',
  robots: 'noindex'
};
