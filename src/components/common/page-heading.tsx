'use client';

import {
  AiOutlineArrowLeft
} from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import style from './page-heading.module.scss';

interface IProps {
  title: string;
  icon?: any;
  action?: Function;
  className?: string;
}

export default function PageHeading({
  title, icon = null, action = null, className = ''
}: IProps) {
  const router = useRouter();
  return (
    <h1 className={`${style['page-heading']} ${className}`}>
      <span aria-hidden onClick={() => (action ? action() : router.back())}>
        {icon || <AiOutlineArrowLeft />}
        {' '}
        {title}
      </span>
    </h1>
  );
}
