'use client';

import { Tab } from 'rc-tabs/lib/interface';
import { ReactNode, useState } from 'react';
import style from './index.module.scss';

interface IProps {
  items: Tab[];
  headingContent?: ReactNode;
  defaultActiveKey?: string;
  onChange?: Function;
  classes?: string;
}

export default function RCTabs({
  items, defaultActiveKey = '', onChange = () => {}, classes = '', headingContent = null
}: IProps) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0].key);
  const activeItem = items.find((f) => f.key === activeKey);

  return (
    <div className={`${style.tabs_rc} ${classes}`}>
      <div className="menu-nav">
        {items.map((t) => (
          <div
            key={t.key}
            className={`${activeKey === t.key ? 'menu-item active' : 'menu-item'}`}
            onClick={() => {
              setActiveKey(t.key);
              onChange && onChange(t.key);
            }}
            aria-hidden
          >
            {t.label}
            <div className="tab-ink-bar" />
          </div>
        ))}
      </div>
      <div className="tab-content">
        {headingContent}
        {activeItem.children}
      </div>
    </div>
  );
}
