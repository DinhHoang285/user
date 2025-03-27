'use client';

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import { AiOutlineHome, AiOutlineContacts } from 'react-icons/ai';
import style from './style.module.scss';

export default function NotFoundContent() {
  const router = useRouter();
  return (
    <div className={style['not-found-page']}>
      <div className="main-container">
        <div className={style['not-found-bl']}>
          <div className={style['not-found-txt']}>
            <h2>Status 404</h2>
            <h1>Oops.... That was unexpected</h1>
          </div>
          <Result
            status="404"
            title="404"
            subTitle="404 - Page not found"
            extra={[
              <Button className="secondary" key="console" onClick={() => router.push('/login')}>
                <AiOutlineHome />
                HOME
              </Button>,
              <Button key="buy" className="primary" onClick={() => router.push('/contact')}>
                <AiOutlineContacts />
                SUPPORT
              </Button>
            ]}
          />
        </div>
      </div>
    </div>
  );
}
