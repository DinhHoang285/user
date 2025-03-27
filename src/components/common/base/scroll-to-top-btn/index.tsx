'use client';

import { useEffect } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import style from './style.module.scss';

export default function ScrollToTopBtn() {
  useEffect(() => {
    const btn = document.getElementById('scroll-top-btn');
    function scrollFunction() {
      if (document.body.scrollTop > 1200 || document.documentElement.scrollTop > 1200) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    }
    window.onscroll = scrollFunction;
  }, []);

  return (
    <button
      id="scroll-top-btn"
      aria-label="scroll-top"
      className={style['scroll-top-btn']}
      type="button"
      onClick={() => window.scrollTo(0, 0)}
    >
      <span>
        <AiOutlineArrowUp />
      </span>
    </button>
  );
}
