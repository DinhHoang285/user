import { DebounceSelect } from '@components/common/base/debouce-select';
import { performerService } from '@services/performer.service';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
  showAll?: boolean;
}

const performerEl = (performer: any) => (

  <div style={{
    display: 'flex', alignItems: 'center', gap: 7, margin: 0, textTransform: 'capitalize'
  }}
  >
    <Image
      height={60}
      width={60}
      alt="avatar"
      style={{
        borderRadius: '50%', height: 20, width: 20, objectFit: 'cover'
      }}
      src={performer?.avatar || '/no-avatar.jpg'}
      sizes="10vw"
    />
    {`${performer?.name || performer?.username || 'Unknow'}`}
  </div>
);

function SelectPerformerDropdown({
  defaultValue, style, onSelect, disabled, showAll, placeholder
}: IProps) {
  const intl = useIntl();
  const [defaultOptions, setDefaultOptions] = useState([]);

  const loadPerformers = async (q: string) => {
    const resp = await performerService.search(!q ? {
      limit: 100, status: 'active', includedIds: defaultValue || ''
    } : {
      limit: 100, status: 'active', q
    });

    const data = [...[{
      disabled: !showAll,
      label: showAll ? intl.formatMessage({ id: 'allCreators', defaultMessage: 'All creators' }) : intl.formatMessage({ id: 'performerSelectACreator', defaultMessage: 'Select a creator' }),
      value: ''
    }], ...(resp?.data?.data || []).map((d) => ({
      value: d._id,
      label: performerEl(d)
    }))];
    (defaultValue || showAll) && setDefaultOptions(data);
    return data;
  };

  useEffect(() => {
    loadPerformers('');
  }, [defaultValue]);

  return (
    <DebounceSelect
      emptyDescription={intl.formatMessage({ id: 'performerNoCreatorFound', defaultMessage: 'No creator found' })}
      defaultOptions={defaultOptions}
      showSearch
      defaultValue={defaultValue}
      placeholder={placeholder}
      style={style}
      onChange={(e) => onSelect(e?.value || '')}
      optionFilterProp="children"
      disabled={disabled}
      fetchOptions={loadPerformers}
      allowClear
    />
  );
}

SelectPerformerDropdown.defaultProps = {
  placeholder: 'Type to search...',
  style: null,
  defaultValue: '',
  disabled: false,
  showAll: false
};

export default SelectPerformerDropdown;
