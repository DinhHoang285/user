import { AiOutlineWallet, AiOutlineHeart } from 'react-icons/ai';
import Link from 'next/link';

type IProps = {
  balance: number;
  totalSubscriber: number;
}

function PerformerDrawerHeader({ balance, totalSubscriber }: IProps) {
  return (
    <>
      <Link href="/my-earning">
        <span>
          <AiOutlineWallet size={25} />
          {`€${balance.toFixed(2)}`}
        </span>
      </Link>
      <Link href="/my-subscriber">
        <span>
          <AiOutlineHeart size={25} />
          Subscribers
        </span>
        <span>
          {totalSubscriber}
        </span>
      </Link>
    </>
  );
}

export default PerformerDrawerHeader;
