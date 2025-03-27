import { AiOutlineWallet, AiOutlinePlusCircle, AiOutlineHeart } from 'react-icons/ai';
import Link from 'next/link';

type IProps = {
  balance: number;
  totalSubscription: number;
}

function UserDrawerHeader({ balance, totalSubscription }: IProps) {
  return (
    <>
      <Link href="/wallet">
        <span>
          <AiOutlineWallet size={25} />
          {`€${balance.toFixed(2)}`}
          <AiOutlinePlusCircle size={14} />
        </span>
      </Link>
      <Link href="/user/my-subscription">
        <span>
          <AiOutlineHeart size={25} />
          <span>Subscription</span>
          <span>{totalSubscription}</span>
        </span>
      </Link>
    </>
  );
}

export default UserDrawerHeader;
