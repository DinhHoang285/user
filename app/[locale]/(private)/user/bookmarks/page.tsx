import { Metadata } from 'next';
import UserBookmarkContent from '@components/user/bookmark-content';

export default function UserBookmarksPage() {
  return (
    <div className="main-container">
      <UserBookmarkContent />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'My Bookmarks',
  robots: 'noindex'
};
