'use client';

import {
  PerformerBlockCountriesForm
} from '@components/performer/management-form/block-countries-form';
import { showError, showSuccess } from '@lib/message';
import {
  blockService
} from '@services/index';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  IBlockCountries
} from 'src/interfaces';

export default function PerformerBlockCountriesList() {
  const [submiting, setsubmiting] = useState(false);
  const { data: session, update: updateUser } = useSession();
  const intl = useIntl();

  return (
    <PerformerBlockCountriesForm
      onFinish={async (data: IBlockCountries) => {
        try {
          setsubmiting(true);
          const resp = await blockService.blockCountries(data);
          updateUser({
            info: { ...session?.user, blockCountries: resp.data.countryCodes }
          });
          showSuccess(intl.formatMessage({ id: 'changesSaved', defaultMessage: 'Changes saved' }));
        } catch (e) {
          showError(e);
        } finally {
          setsubmiting(false);
        }
      }}
      updating={submiting}
      blockCountries={session?.user?.blockCountries || { countryCodes: [] }}
    />
  );
}
