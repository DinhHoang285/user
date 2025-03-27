import { AiOutlineSearch } from 'react-icons/ai';
import { Input } from 'antd';
import { useIntl } from 'react-intl';
import style from './search-bar.module.scss';

interface IProps {
  onSearch: Function;
}

export function ConversationSearch({ onSearch }: IProps) {
  const intl = useIntl();
  return (
    <div className={style['conversation-search']}>
      <Input
        addonBefore={<AiOutlineSearch />}
        onChange={(v) => onSearch(v)}
        className={style['conversation-search-input']}
        placeholder={intl.formatMessage({ id: 'searchContact', defaultMessage: 'Search contact...' })}
      />
    </div>
  );
}

export default ConversationSearch;
