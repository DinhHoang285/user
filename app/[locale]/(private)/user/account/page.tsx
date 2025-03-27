'use client';

import { AiOutlineEdit } from 'react-icons/ai';
import PageHeading from '@components/common/page-heading';
import UserAccountFormComponent from '@components/user/account-form';
import { useIntl } from 'react-intl';

function UserAccountSettingPage() {
  const intl = useIntl();
  return (
    <div className="main-container">
      <PageHeading title={intl.formatMessage({ id: 'editProfile', defaultMessage: 'Edit Profile' })} icon={<AiOutlineEdit />} />
      <UserAccountFormComponent />
    </div>
  );
}

export default UserAccountSettingPage;
