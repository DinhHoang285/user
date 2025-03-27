import { shortenLargeNumber } from '@lib/number';
import classNames from 'classnames';
import { AiOutlineComment } from 'react-icons/ai';
import style from './style.module.scss';

type IProps = {
  onClick: Function;
  totalComment?: number;
  active?: boolean;
  inContentView?: boolean;
  inShort?: boolean
};

function CommentButton({
  onClick,
  totalComment = 0,
  active = false,
  inContentView = false,
  inShort = false
}: IProps) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={classNames(style['ant-btn'], style['action-btn'], {
        [style.active]: active,
        [style.inContentView]: inContentView,
        [style.inShort]: inShort
      })}
    >
      <span style={{
        margin: '0 4px'
      }}
      >
        {totalComment > 0 && !inContentView && shortenLargeNumber(totalComment)}
      </span>
      <span>
        <AiOutlineComment style={{ display: 'flex', alignItems: 'center' }} />
      </span>
    </button>
  );
}

CommentButton.defaultProps = {
  totalComment: 0,
  active: false,
  inContentView: false,
  inShort: false
};

export default CommentButton;
