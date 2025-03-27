import { Button, Modal } from 'antd';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Circle18Svg } from 'src/icons';
import style from './popup-18.module.scss';

interface P {
  content18Popup: string;
  logo: string;
  darkmodeLogo: string;
}

function Popup18Warning({ content18Popup, darkmodeLogo, logo }: P) {
  const [open18Popup, setOpen18Popup] = useState(false);
  const { theme } = useTheme();

  const check18Popup = async () => {
    const accepted18 = localStorage.getItem('accepted18');
    if (!accepted18 || accepted18 !== 'true') {
      setOpen18Popup(true);
    }
  };

  useEffect(() => {
    check18Popup();
  }, []);

  if (!open18Popup) return null;
  return (
    <Modal
      className={style['popup-18-modal']}
      width={600}
      open={open18Popup}
      title={null}
      centered
      onCancel={() => {
        window.location.href = 'https://www.google.com';
      }}
      footer={(
        <div className={style['btn-grps']}>
          <Button
            className="error"
            onClick={() => {
              window.location.href = 'https://www.google.com';
            }}
          >
            EXIT
          </Button>
          &nbsp;
          <Button
            className="primary"
            onClick={() => {
              localStorage.setItem('accepted18', 'true');
              setOpen18Popup(false);
            }}
          >
            I AGREE
          </Button>
        </div>
      )}
    >
      <div className={style['popup-header']}>
        <div className={style['logo-img']}>
          {
            (darkmodeLogo || logo)
            && (
              <Image
                // fill
                width={150}
                height={40}
                priority
                src={theme === 'dark' ? darkmodeLogo : logo || '/leaf.jpg'}
                alt="logo"
              />
            )
          }
        </div>
        <Circle18Svg />
      </div>
      <div
        className={style['popup-content']}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: content18Popup || 'Please confirm you are over 18+'
        }}
      />
    </Modal>
  );
}

export default Popup18Warning;
