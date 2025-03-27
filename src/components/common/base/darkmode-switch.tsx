'use client';

import { AiOutlineBulb, AiOutlineCloud } from 'react-icons/ai';
import { checkDarkmode } from '@lib/string';
import { Switch } from 'antd';
import { useTheme } from 'next-themes';
import style from './darkmode-switch.module.scss';

export default function DarkmodeSwitch() {
  const { theme, setTheme } = useTheme();

  const onThemeChange = (t: string) => {
    setTheme(t);
  };

  return (
    <div
      className={style['switch-theme']}
    >
      {checkDarkmode(theme) ? (
        <AiOutlineCloud />
      ) : (
        <AiOutlineBulb />
      )}
      <Switch
        checked={checkDarkmode(theme)}
        checkedChildren="Dark"
        unCheckedChildren="Light"
        onChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
      />
    </div>
  );
}
